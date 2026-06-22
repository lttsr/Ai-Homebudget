package api.usecase.cron;

import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import api.config.AppProperties;
import api.context.orm.OrmRepository;
import api.cron.BatchJob;
import api.model.budget.DailyHomeBudget;
import api.model.budget.MontlySummary;
import api.model.master.BudgetCategory;
import api.model.master.PaymentAccount;
import api.usecase.bedrock.BedrockService;
import api.usecase.budget.DailyHomeBudgetService;
import api.util.document.CsvUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 月次更新バッチ
 * 前月分の家計簿確定処理を実行します。
 * ・前月分の家計簿詳細データをCSVファイルに出力
 * ・前月分の家計簿サマリの確定処理
 * ・当月分の家計簿サマリの作成処理
 * ・当月分の家計簿データを一括登録処理
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MonthlyUpdate implements BatchJob {
    private static final String JOB_NAME = "monthly-update";
    private final BedrockService bedrock;
    private final DailyHomeBudgetService service;
    private final OrmRepository rep;
    private final AppProperties props;

    @Override
    public String jobName() {
        return JOB_NAME;
    }

    @Override
    @Transactional
    public void execute(LocalDate execDate) {
        try {
            log.info("月次更新バッチ処理: 実行日={}", execDate);
            var curMonth = YearMonth.from(execDate);
            var preMonth = curMonth.minusMonths(1);

            // 前月分の家計簿詳細データをCSVファイルに出力します。
            var details = service.getDetailsByYM(preMonth);
            Map<Long, String> categoryNames = loadCategoryNames();
            Map<Long, String> accountNames = loadAccountNames();
            String csv = CsvUtil.toCsv(
                    List.of("日付", "家計簿ID", "詳細ID", "カテゴリ", "入出方法", "入金・支出区分", "金額", "備考"),
                    details,
                    d -> List.of(
                            CsvUtil.cell(d.date()),
                            CsvUtil.cell(d.budgetId()),
                            CsvUtil.cell(d.detailId()),
                            CsvUtil.cell(resolveName(categoryNames, d.categoryId())),
                            CsvUtil.cell(resolveName(accountNames, d.accountId())),
                            CsvUtil.cell(d.expenseType()),
                            CsvUtil.cell(d.price()),
                            CsvUtil.cell(d.memo())));
            Path path = props.getReportDir().resolve("report_" + preMonth.toString() + ".csv");
            CsvUtil.write(path, csv);

            // 前月分の家計簿サマリの確定処理を実行します。
            var summary = MontlySummary.confirm(rep, preMonth);

            String prompt = "前月分の家計簿情報を元にコメントを記載してください。\n" +
                    "合計収入額 : " + summary.getIncomeTotal() + "\n" +
                    "合計支出額 : " + summary.getExpenseTotal() + "\n" +
                    "合計貯蓄額 : " + summary.getSavings() + "\n" +
                    "貯蓄目標額 : " + summary.getSavingsTarget() + "\n" +
                    "達成率 : " + summary.getAchievementRate();

            // Bedrock Agentに質問を送信します。
            String comment = bedrock.ask(prompt, csv);
            summary.updateComment(rep, comment);

            // 当月分の家計簿サマリの作成処理を実行します。
            MontlySummary.register(rep, curMonth, summary.getSavingsTarget());

            // 当月分の家計簿データを一括登録処理を実行します。
            DailyHomeBudget.registerAll(rep, YearMonth.from(execDate));
            log.info("月次更新バッチ処理: 完了");

        } catch (IOException e) {
            log.error("月次更新バッチ処理: エラー={}", e.getMessage());

            throw new RuntimeException(e);
        }
    }

    private Map<Long, String> loadCategoryNames() {
        return BudgetCategory.findAll(rep).stream()
                .collect(Collectors.toMap(BudgetCategory::getCategoryId, BudgetCategory::getName));
    }

    private Map<Long, String> loadAccountNames() {
        return PaymentAccount.findAll(rep).stream()
                .collect(Collectors.toMap(PaymentAccount::getAccountId, PaymentAccount::getName));
    }

    private String resolveName(Map<Long, String> names, Long id) {
        return names.getOrDefault(id, "");
    }
}
