package twm.getpower.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import twm.getpower.dto.TipDTO;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "tip")
public class TipDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "code")
    private String code;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private EventDomain event;

    public static TipDTO toDTO(TipDomain tipDomain) {
        TipDTO tipDTO = new TipDTO();
        tipDTO.setId(tipDomain.getId());
        tipDTO.setDescription(tipDomain.getDescription());
        tipDTO.setCode(tipDomain.getCode());
        tipDTO.setEventId(tipDomain.getEvent().getId());
        return tipDTO;
    }
}
