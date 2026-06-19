package api.usecase.cron;

import java.time.LocalDate;
import java.time.YearMonth;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import api.context.orm.OrmRepository;
import api.cron.BatchJob;
import api.model.budget.DailyHomeBudget;
import api.model.budget.MontlySummary;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 月次更新バッチ（前月確定・当月 summary 作成・日次家計簿 insert）。
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MonthlyUpdate implements BatchJob {
    private static final String JOB_NAME = "monthly-update";

    private final OrmRepository rep;

    @Override
    public String jobName() {
        return JOB_NAME;
    }

    @Override
    @Transactional
    public void execute(LocalDate execDate) {
        log.info("月次更新バッチ処理: 実行日={}", execDate);
        var curMonth = YearMonth.from(execDate);
        var preMonth = curMonth.minusMonths(1);

        // 前月分の家計簿サマリの確定処理を実行します。
        var comment = "Bedrock実装";
        var summary = MontlySummary.confirm(rep, preMonth, comment);

        // 当月分の家計簿サマリの作成処理を実行します。
        MontlySummary.register(rep, curMonth, summary.getSavingsTarget());

        // 当月分の家計簿データを一括登録処理を実行します。
        DailyHomeBudget.registerAll(rep, YearMonth.from(execDate));
        log.info("月次更新バッチ処理: 完了");
    }
}
