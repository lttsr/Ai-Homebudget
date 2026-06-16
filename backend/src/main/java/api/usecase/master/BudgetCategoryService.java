package api.usecase.master;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import api.context.orm.OrmRepository;
import api.model.master.BudgetCategory;
import api.model.master.BudgetCategory.RegisterBudgetCategory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BudgetCategoryService {
    private final OrmRepository rep;

    /**
     * カテゴリマスタ一覧を取得します。
     *
     * @return カテゴリマスタ一覧
     */
    public List<BudgetCategory> getBudgetCategoryList() {
        return BudgetCategory.findAll(rep);
    }

    /**
     * カテゴリマスタを登録します。
     *
     * @param param カテゴリマスタ登録パラメータ
     * @return カテゴリマスタ
     */
    @Transactional
    public BudgetCategory registerBudgetCategory(RegisterBudgetCategory param) {
        return BudgetCategory.register(rep, param);
    }
}
