package api.cron;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

/**
 * ジョブ名に応じて {@link BatchJob} 実装を呼び出す共通ディスパッチャ。
 */
@Component
public class BatchJobDispatcher {

    private final Map<String, BatchJob> jobMap;

    public BatchJobDispatcher(List<BatchJob> jobs) {
        this.jobMap = jobs.stream()
                .collect(Collectors.toMap(BatchJob::jobName, job -> job));
    }

    /**
     * 指定されたジョブ名のバッチを実行します。
     *
     * @param jobName  yml のキー名
     * @param execDate 実行基準日
     */
    public void execute(String jobName, LocalDate execDate) {
        BatchJob job = jobMap.get(jobName);
        job.execute(execDate);
    }
}
