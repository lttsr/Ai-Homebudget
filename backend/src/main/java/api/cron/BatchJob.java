package api.cron;

import java.time.LocalDate;

/**
 * バッチジョブの処理本体を表すインタフェース。
 * {@link #jobName()} は application.yml の app.batch.jobs のキー名と一致させます。
 */
public interface BatchJob {

    /** ジョブ名 */
    String jobName();

    /** バッチ処理を実行します。 */
    void execute(LocalDate executionDate);
}
