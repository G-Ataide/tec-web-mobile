package twm.getpower.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import twm.getpower.domain.TipDomain;
import twm.getpower.repository.EventRepository;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TipDTO {

    private Long id;
    private String description;
    private String code;
    private Long eventId;

    public static TipDomain toDomain(TipDTO tipDTO, EventRepository eventRepository) {
        TipDomain tipDomain = new TipDomain();
        tipDomain.setId(tipDTO.getId());
        tipDomain.setDescription(tipDTO.getDescription());
        tipDomain.setCode(tipDTO.getCode());
        tipDomain.setEvent(eventRepository.findById(tipDTO.getEventId()).get());
        return tipDomain;
    }
}
