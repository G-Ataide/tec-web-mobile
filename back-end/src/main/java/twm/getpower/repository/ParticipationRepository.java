package twm.getpower.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import twm.getpower.domain.EventDomain;
import twm.getpower.domain.ParticipationDomain;

import java.util.Optional;

@Repository
public interface ParticipationRepository extends JpaRepository<ParticipationDomain, Long> {

    Optional<ParticipationDomain> findById(Long id);

    Optional<ParticipationDomain> findAllByEmailAndEventIdAndTsRemovedIsNull(String email, Long id);
}

