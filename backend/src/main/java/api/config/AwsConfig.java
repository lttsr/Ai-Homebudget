package api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import api.config.AppProperties.BedrockProps;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockagentruntime.BedrockAgentRuntimeAsyncClient;

@Configuration
public class AwsConfig {

    /**
     * BedrockAgentRuntimeAsyncClientを生成します。
     *
     * @param props アプリケーション設定
     * @return BedrockAgentRuntimeAsyncClient
     */
    @Bean
    public BedrockAgentRuntimeAsyncClient bedrockAgentRuntimeAsyncClient(AppProperties props) {
        return BedrockAgentRuntimeAsyncClient.builder()
                .region(Region.of(props.getAws().getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.builder().build())
                .build();
    }

    @Bean
    public BedrockProps bedrockProps(AppProperties props) {
        return props.getAws().getBedrock();
    }

}
