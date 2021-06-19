package twm.getpower.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "participation")
public class ParticipationDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "email")
    private String email;

    @Column(name = "ts_created")
    private LocalDateTime tsCreated = LocalDateTime.now();

    @Column(name = "ts_removed")
    private LocalDateTime tsRemoved;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private EventDomain event;

}
