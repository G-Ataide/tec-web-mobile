package twm.getpower.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import twm.getpower.dto.EventDTO;
import twm.getpower.dto.TipDTO;
import twm.getpower.repository.TipRepository;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "event")
public class EventDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", unique = true)
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "creator_name")
    private String creatorName;

    @Column(name = "ts_created")
    private LocalDateTime tsCreated = LocalDateTime.now();

    @Column(name = "ts_removed")
    private LocalDateTime tsRemoved;

    @Column(name = "ts_start")
    private LocalDateTime tsStart;

    @Column(name = "ts_end")
    private LocalDateTime tsEnd;


    public static EventDTO toDTO(EventDomain eventDomain, TipRepository tipsRepository) {
        EventDTO eventDTO = new EventDTO();

        eventDTO.setId(eventDomain.getId());
        eventDTO.setCode(eventDomain.getCode());
        eventDTO.setName(eventDomain.getName());
        eventDTO.setCreatorName(eventDomain.getCreatorName());
        eventDTO.setTsCreated(eventDomain.getTsCreated());
        eventDTO.setTsRemoved(eventDomain.getTsRemoved());
        eventDTO.setTsStart(eventDomain.getTsStart());
        eventDTO.setTsEnd(eventDomain.getTsEnd());

        List<TipDTO> tipDTOs = new ArrayList<TipDTO>();

        tipsRepository.findAllByEventId(eventDomain.getId()).stream().forEach(t->{
            tipDTOs.add(TipDomain.toDTO(t));
        });

        eventDTO.setTips(tipDTOs);
        return eventDTO;

    }
}
