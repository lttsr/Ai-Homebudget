package api.config;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import api.config.DbConfig.DefaultRepository;
import api.context.orm.DataSourceProperties;
import api.context.orm.OrmRepositoryProperties;
import jakarta.persistence.EntityManagerFactory;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private ServerProps server;
    private DbProps db;
    private BatchProps batch;
    private AwsProps aws;

    /**
     * Server properties
     */
    @Data
    public static class ServerProps {
        private String baseUrl;
        private List<String> corsAllowedOriginPatterns;
    }

    /**
     * Database properties
     */
    /** 標準スキーマのDataSourceを生成します。 */
    @Data
    @EqualsAndHashCode(callSuper = false)
    public static class DbProps extends DataSourceProperties {
        private OrmRepositoryProperties jpa = new OrmRepositoryProperties();

        @Override
        public DataSource dataSource() {
            return super.dataSource();
        }

        public LocalContainerEntityManagerFactoryBean entityManagerFactoryBean(
                final DataSource dataSource) {
            return jpa.entityManagerFactoryBean(
                    DefaultRepository.BeanNameEmf, dataSource);
        }

        public JpaTransactionManager transactionManager(final EntityManagerFactory emf) {
            return jpa.transactionManager(emf);
        }
    }

    /**
     * Batch properties
     */
    @Data
    public static class BatchProps {
        private Map<String, BatchSettings> jobs = new HashMap<>();
    }

    @Data
    public static class BatchSettings {
        private boolean enabled = false;
        private String cron;
        private String zone = "Asia/Tokyo";
    }

    /**
     * AWS properties
     */
    @Data
    public static class AwsProps {
        private String region;
        private BedrockProps bedrock = new BedrockProps();
    }

    @Data
    public static class BedrockProps {
        private String modelId;
    }
}
