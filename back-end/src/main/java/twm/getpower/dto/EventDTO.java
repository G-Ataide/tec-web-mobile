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
public class EventDTO {

    private Long id;
    private String code;
    private String name;
    private String creatorName;
    private LocalDateTime tsCreated = LocalDateTime.now();
    private LocalDateTime tsRemoved;
    private LocalDateTime tsStart;
    private LocalDateTime tsEnd;
    private List<TipDTO> tips;

    public static EventDomain toDomain(EventDTO eventDTO) {
        EventDomain eventDomain = new EventDomain();
        eventDomain.setId(eventDTO.getId());
        eventDomain.setCode(eventDTO.getCode());
        eventDomain.setName(eventDTO.getName());
        eventDomain.setCreatorName(eventDTO.getCreatorName());
        eventDomain.setTsCreated(eventDTO.getTsCreated());
        eventDomain.setTsRemoved(eventDTO.getTsRemoved());
        eventDomain.setTsStart(eventDTO.getTsStart());
        eventDomain.setTsEnd(eventDTO.getTsEnd());
        return eventDomain;
    }
}
