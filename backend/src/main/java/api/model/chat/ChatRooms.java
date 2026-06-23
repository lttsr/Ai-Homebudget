package api.model.chat;

import java.time.LocalDateTime;

import api.context.DomainEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRooms implements DomainEntity {
    /** チャットルームID */
    @Id
    private String roomId;

    /** チャットルームUUID */
    @NotNull
    private String agentSessionId;

    /** チャットルーム名 */
    @NotNull
    private String roomName;

    /** チャットルーム説明 */
    private String description;

    /** チャットルーム作成日時 */
    @NotNull
    private LocalDateTime registeredDate;

    /** 更新日時 */
    @NotNull
    private LocalDateTime updatedDate;
}
