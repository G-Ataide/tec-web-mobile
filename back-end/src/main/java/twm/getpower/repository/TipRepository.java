package twm.getpower.repository;

import org.springframework.stereotype.Repository;
import twm.getpower.domain.TipDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import twm.getpower.dto.TipDTO;

import java.util.List;
import java.util.Optional;

@Repository
public interface TipRepository extends JpaRepository<TipDomain, Long> {

    Optional<TipDomain> findById(Long id);

    List<TipDomain> findAllByEventId(Long id);
}

