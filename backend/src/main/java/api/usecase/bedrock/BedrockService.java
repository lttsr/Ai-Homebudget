package api.usecase.bedrock;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import api.config.AppProperties.BedrockProps;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.services.bedrockagentruntime.BedrockAgentRuntimeAsyncClient;
import software.amazon.awssdk.services.bedrockagentruntime.model.InvokeAgentRequest;
import software.amazon.awssdk.services.bedrockagentruntime.model.InvokeAgentResponseHandler;

@Service
@Slf4j
@RequiredArgsConstructor
public class BedrockService {
    private final BedrockAgentRuntimeAsyncClient client;
    private final BedrockProps bedrockProps;

    /**
     * Bedrock Agentに質問を送信します。
     *
     * @param prompt    プロンプト
     * @param documents 添付ドキュメント（CSVなど）
     * @return 応答テキスト
     */
    public String ask(String prompt, String... documents) {
        String inputText = buildInputText(prompt, documents);
        var request = InvokeAgentRequest.builder()
                .agentId(bedrockProps.getAgentId())
                .agentAliasId(bedrockProps.getAgentAliasId())
                .sessionId(UUID.randomUUID().toString())
                .inputText(inputText)
                .build();
        StringBuilder response = new StringBuilder();
        InvokeAgentResponseHandler handler = InvokeAgentResponseHandler.builder()
                .subscriber(InvokeAgentResponseHandler.Visitor.builder()
                        .onChunk(chunk -> response.append(chunk.bytes().asUtf8String()))
                        .build())
                .build();
        try {
            client.invokeAgent(request, handler).join();
            return response.toString();
        } catch (Exception e) {
            log.error("Bedrock Agentの呼び出しに失敗しました", e);
            throw new RuntimeException("Bedrock Agentの呼び出しに失敗しました", e);
        }
    }

    private String buildInputText(String prompt, String... documents) {
        StringBuilder inputText = new StringBuilder(prompt);
        if (documents == null) {
            return inputText.toString();
        }
        for (String document : documents) {
            if (StringUtils.hasText(document)) {
                inputText.append("\n").append(document);
            }
        }
        return inputText.toString();
    }
}
