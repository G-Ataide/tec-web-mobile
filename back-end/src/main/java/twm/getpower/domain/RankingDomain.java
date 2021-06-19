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
@Table(name = "ranking")
public class RankingDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private EventDomain event;

    @ManyToOne
    @JoinColumn(name = "participation_id")
    private ParticipationDomain participation;

    @Column(name = "ts_created")
    private LocalDateTime tsCreated = LocalDateTime.now();

    @Column(name = "ts_removed")
    private LocalDateTime tsRemoved;


}
