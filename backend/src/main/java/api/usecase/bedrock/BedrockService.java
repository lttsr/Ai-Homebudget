package api.usecase.bedrock;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import api.config.AppProperties.BedrockProps;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.ContentBlock;
import software.amazon.awssdk.services.bedrockruntime.model.ConversationRole;
import software.amazon.awssdk.services.bedrockruntime.model.ConverseRequest;
import software.amazon.awssdk.services.bedrockruntime.model.ConverseResponse;
import software.amazon.awssdk.services.bedrockruntime.model.DocumentBlock;
import software.amazon.awssdk.services.bedrockruntime.model.Message;

@Service
@Slf4j
@RequiredArgsConstructor
public class BedrockService {
    private final BedrockRuntimeClient syncClient;
    private final BedrockProps bedrockProps;

    /**
     * Bedrockに質問を送信します。
     *
     * @param prompt    プロンプト
     * @param documents 添付ドキュメント
     * @return 応答テキスト
     */
    public String ask(String prompt, DocumentBlock... documents) {
        List<ContentBlock> contents = new ArrayList<>();
        contents.add(ContentBlock.fromText(prompt));

        for (DocumentBlock document : documents) {
            if (document != null) {
                contents.add(ContentBlock.fromDocument(document));
            }
        }

        var request = ConverseRequest.builder()
                .modelId(bedrockProps.getModelId())
                .messages(Message.builder()
                        .role(ConversationRole.USER)
                        .content(contents)
                        .build())
                .build();

        try {
            ConverseResponse response = syncClient.converse(request);
            return response.output().message().content().get(0).text();
        } catch (Exception e) {
            log.error("Bedrockの呼び出しに失敗しました", e);
            throw new RuntimeException("Bedrockの呼び出しに失敗しました", e);
        }
    }
}
