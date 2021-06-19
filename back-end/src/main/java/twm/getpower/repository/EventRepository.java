package twm.getpower.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import twm.getpower.domain.EventDomain;

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<EventDomain, Long> {

    Optional<EventDomain> findById(Long id);

    Optional<EventDomain> findByCode(String code);

}

