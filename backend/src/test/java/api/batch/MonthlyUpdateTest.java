package api.batch;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import api.cron.BatchJobDispatcher;

@SpringBootTest
class MonthlyUpdateBatchTest {
    @Autowired
    BatchJobDispatcher dispatcher;

    @Test
    void 月次バッチを手動実行() {
        dispatcher.execute("monthly-update", LocalDate.of(2026, 6, 1));
    }
}
