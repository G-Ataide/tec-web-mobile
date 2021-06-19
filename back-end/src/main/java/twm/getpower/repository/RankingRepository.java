package twm.getpower.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import twm.getpower.domain.EventDomain;
import twm.getpower.domain.ParticipationDomain;
import twm.getpower.domain.RankingDomain;

import java.util.List;
import java.util.Optional;

@Repository
public interface RankingRepository extends JpaRepository<RankingDomain, Long> {

    Optional<RankingDomain> findById(Long id);

    List<RankingDomain> findAllByEventAndParticipation(EventDomain event, ParticipationDomain participationDomain);

    List<RankingDomain> findAllByEventAndTsRemovedIsNull(EventDomain event);

}