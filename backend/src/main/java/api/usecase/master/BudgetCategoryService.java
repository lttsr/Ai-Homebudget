package api.usecase.master;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import api.context.orm.OrmRepository;
import api.controller.master.BudgetCategoryController.RegisterBudgetCategoryRequest;
import api.model.master.BudgetCategory;
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
    public BudgetCategory registerBudgetCategory(RegisterBudgetCategoryRequest param) {
        return BudgetCategory.register(rep, param);
    }
}
