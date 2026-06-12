package api.config;

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

    /**
     * Server properties
     */
    @Data
    public static class ServerProps {
        private String baseUrl;
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
}
