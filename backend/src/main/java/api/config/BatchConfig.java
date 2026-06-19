package api.config;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.util.StringUtils;

import api.config.AppProperties.BatchSettings;
import api.cron.BatchJobDispatcher;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * application.yml の app.batch.jobs を読み取り、TaskScheduler にバッチを登録します。
 * <p>
 * {@code @Scheduled} は使わず、起動時に cron を動的登録する方式です。
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class BatchConfig {

    private final AppProperties props;
    private final TaskScheduler scheduler;
    private final BatchJobDispatcher dispatcher;

    @PostConstruct
    void register() {
        if (props.getBatch().getJobs().isEmpty()) {
            return;
        }
        props.getBatch().getJobs().forEach((jobName, settings) -> schedule(jobName, settings));
    }

    private void schedule(String jobName, BatchSettings settings) {
        if (!settings.isEnabled() || !StringUtils.hasText(settings.getCron())) {
            return;
        }
        ZoneId zone = ZoneId.of(settings.getZone());
        CronTrigger trigger = new CronTrigger(settings.getCron(), zone);

        scheduler.schedule(() -> exec(jobName, zone), trigger);
    }

    /**
     * バッチを実行します。
     *
     * @param jobName バッチ名
     * @param zone    タイムゾーン
     */
    private void exec(String jobName, ZoneId zone) {
        LocalDate execDate = ZonedDateTime.now(zone).toLocalDate();
        dispatcher.execute(jobName, execDate);
    }
}
