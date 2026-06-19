package api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import api.config.AppProperties.BedrockProps;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeAsyncClient;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;

@Configuration
public class AwsConfig {

    /**
     * BedrockRuntimeClientを生成します。
     *
     * @param props
     * @return BedrockRuntimeClient
     */
    @Bean
    public BedrockRuntimeClient bedrockRuntimeClient(AppProperties props) {
        return BedrockRuntimeClient.builder()
                .region(Region.of(props.getAws().getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.builder().build())
                .build();
    }

    /**
     * BedrockRuntimeAsyncClientを生成します。
     *
     * @param props
     * @return BedrockRuntimeAsyncClient
     */
    @Bean
    public BedrockRuntimeAsyncClient bedrockRuntimeAsyncClient(AppProperties props) {
        return BedrockRuntimeAsyncClient.builder()
                .region(Region.of(props.getAws().getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.builder().build())
                .build();
    }

    @Bean
    public BedrockProps bedrockProps(AppProperties props) {
        return props.getAws().getBedrock();
    }

}
