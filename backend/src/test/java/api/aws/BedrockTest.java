package api.aws;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.model.GetCallerIdentityResponse;

/**
 * 認証情報チェックテスト
 * 接続ARNを取得します。
 * Bedrockへのアクセス権限があるIAMユーザー、IAMロールを付与してください。
 *
 * 環境変数 $AWS_ACCESS_KEY_ID $AWS_SECRET_ACCESS_KEY
 */
class BedrockTest {

    @Test
    void 認証情報チェックテスト() {
        try (StsClient stsClient = StsClient.builder()
                .region(Region.AP_NORTHEAST_1)
                .credentialsProvider(DefaultCredentialsProvider.builder().build())
                .build()) {

            GetCallerIdentityResponse response = stsClient.getCallerIdentity();
            System.out.println("★テスト環境の接続ARN: " + response.arn());
            assertNotNull(response.arn());

        } catch (Exception e) {
            System.err.println("★認証情報が見つかりません: " + e.getMessage());

        }
    }
}
