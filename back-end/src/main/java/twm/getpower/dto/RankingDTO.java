package twm.getpower.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RankingDTO {

    public Long eventId;
    public LocalDateTime tsCreated;
    public String eventCode;
    public Long participationId;
    public String participationEmail;
    public String participationName;
}
