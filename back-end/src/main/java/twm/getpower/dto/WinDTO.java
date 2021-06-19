package twm.getpower.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import twm.getpower.domain.EventDomain;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WinDTO {

    private String eventCode;
    private Long userId;
    private LocalDateTime tsCreated = LocalDateTime.now();
    private LocalDateTime tsRemoved;
}
