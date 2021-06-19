package twm.getpower.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import twm.getpower.domain.EventDomain;
import twm.getpower.domain.RankingDomain;
import twm.getpower.dto.RankingDTO;
import twm.getpower.exception.BadRequestException;
import twm.getpower.repository.EventRepository;
import twm.getpower.repository.RankingRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class RankingService {

    private final RankingRepository rankingRepository;
    private final EventRepository eventRepository;

    public List<RankingDTO> rankingByCode(String eventCode) {

        Optional<EventDomain> optionalEventDomain = eventRepository.findByCode(eventCode);

        if (!optionalEventDomain.isPresent()){
            log.info("Evento Não Encontrado, tente novamente.");
            throw new BadRequestException("Evento Não Encontrado, tente novamente.");
        }

        List<RankingDTO> rankingDTOS = new ArrayList<>();

        List<RankingDomain> rankingDomains = rankingRepository.findAllByEventAndTsRemovedIsNull(optionalEventDomain.get());

        rankingDomains.stream().forEach(r->{
            RankingDTO rankingDTO = new RankingDTO();
            rankingDTO.setEventId(r.getEvent().getId());
            rankingDTO.setEventCode(r.getEvent().getCode());
            rankingDTO.setParticipationId(r.getParticipation().getId());
            rankingDTO.setParticipationName(r.getParticipation().getUserName());
            rankingDTO.setParticipationEmail(r.getParticipation().getEmail());
            rankingDTO.setTsCreated(r.getTsCreated());
            rankingDTOS.add(rankingDTO);
        });

        rankingDTOS.sort(new Comparator<RankingDTO>() {
            @Override
            public int compare(RankingDTO o1, RankingDTO o2) {
                return o1.getTsCreated().compareTo(o2.getTsCreated());
            }
        });

        return rankingDTOS;

    }
}
