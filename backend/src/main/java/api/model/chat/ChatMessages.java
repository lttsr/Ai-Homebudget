package api.model.chat;

import java.time.LocalDateTime;

import api.context.DomainEntity;
import api.model.chat.type.MessageRoleType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;

public class ChatMessages implements DomainEntity {

    /** チャットメッセージID */
    @Id
    private String messageId;

    /** チャットルームID */
    @NotNull
    private String roomId;

    /** チャットメッセージ */
    @NotNull
    private String message;

    /** チャットメッセージタイプ */
    @NotNull
    private MessageRoleType messageRoleType;

    /** 登録日時 */
    @NotNull
    private LocalDateTime registeredDate;

    /** 更新日時 */
    @NotNull
    private LocalDateTime updatedDate;
}
