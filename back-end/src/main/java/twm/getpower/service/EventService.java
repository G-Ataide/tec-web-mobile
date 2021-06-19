package twm.getpower.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import twm.getpower.domain.EventDomain;
import twm.getpower.domain.ParticipationDomain;
import twm.getpower.domain.RankingDomain;
import twm.getpower.domain.TipDomain;
import twm.getpower.dto.*;
import twm.getpower.exception.BadRequestException;
import twm.getpower.repository.EventRepository;
import twm.getpower.repository.ParticipationRepository;
import twm.getpower.repository.RankingRepository;
import twm.getpower.repository.TipRepository;
import twm.getpower.validation.EmailValidation;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Log4j2
public class EventService {

    private final EventRepository eventRepository;
    private final TipRepository tipRepository;
    private final ParticipationRepository participationRepository;
    private final RankingRepository rankingRepository;

    public String transformData(LocalDateTime localDateTime){

        String data = DateTimeFormatter.ofPattern("dd/MM/yyyy").format(localDateTime);
        String hora = DateTimeFormatter.ofPattern("HH:mm").format(localDateTime);

        return data + " às " + hora;
    }

    @Transactional
    public EventDTO save(EventDTO eventDTO) {

        String code;

        while(true){
            code = UUID.randomUUID().toString().replace("-","").substring(0,8).toUpperCase();
            if(!eventRepository.findByCode(code).isPresent()) {
                break;
            }
        }

        eventDTO.setCode(code);

        if(eventDTO.getTsStart().isBefore(LocalDateTime.now())){



            log.info("TsStart is Before current timestamp");
            log.info("TSStart: ".concat(eventDTO.getTsStart().toString()));
            log.info("Now: ".concat(LocalDateTime.now().toString()));
            throw new BadRequestException("TsStart is Before current timestamp");
        }

        if(eventDTO.getTsEnd().isBefore(eventDTO.getTsStart())){
            log.info("TsEnd is Before TsStart");
            throw new BadRequestException("TsEnd is Before TsStart");
        }

        if(eventDTO.getTsEnd().isEqual(eventDTO.getTsStart())){
            log.info("TsEnd is Equal TsStart");
            throw new BadRequestException("TsEnd is Equal TsStart");
        }

        if(eventDTO.getTips().isEmpty() || eventDTO.getTips() == null){
            log.info("Pistas Vazias, preencha corretamente");
            throw new BadRequestException("Pistas Vazias, preencha corretamente");
        }

        EventDomain eventDomainSaved = eventRepository.save(EventDTO.toDomain(eventDTO));

        eventDTO.getTips().stream().forEach(t->{
            if(t.getEventId()==null){
                t.setEventId(eventDomainSaved.getId());
            }
            TipDomain tDomain = TipDTO.toDomain(t,eventRepository);
            tipRepository.save(tDomain);
        });

        EventDTO eventDTOToReturn = EventDomain.toDTO(eventDomainSaved,tipRepository);

        return eventDTOToReturn;
    }

    public JoinEventDTO join(JoinEventDTO joinEventDTO) {

        if (!EmailValidation.isEmail(joinEventDTO.getEmail())){
            log.info("Email is invalid");
            throw new BadRequestException("Email is invalid");
        }

        Optional<EventDomain> eventDomain = eventRepository.findByCode(joinEventDTO.getEventCode());

        if(!eventDomain.isPresent()){
            log.info("Event not found");
            throw new BadRequestException("Event not found");
        }

        if(eventDomain.get().getTsRemoved()!=null){
            log.info("Event canceled in ".concat(eventDomain.get().getTsRemoved().toString()));
            throw new BadRequestException("Event canceled in ".concat(eventDomain.get().getTsRemoved().toString()));
        }

        if(eventDomain.get().getTsEnd().isBefore(LocalDateTime.now())){
            log.info("Event ended in ".concat(eventDomain.get().getTsEnd().toString()));
            throw new BadRequestException("Event ended in ".concat(eventDomain.get().getTsEnd().toString()));
        }

        Optional<ParticipationDomain> optionalParticipationDomain = participationRepository.findAllByEmailAndEventIdAndTsRemovedIsNull(joinEventDTO.getEmail(), eventDomain.get().getId());

        if(optionalParticipationDomain.isPresent()){
            joinEventDTO.setUserId(optionalParticipationDomain.get().getId());
            return joinEventDTO;
        }

        ParticipationDomain participationDomain = new ParticipationDomain();

        participationDomain.setEmail(joinEventDTO.getEmail());
        participationDomain.setUserName(joinEventDTO.getUserName());
        participationDomain.setEvent(eventDomain.get());

        ParticipationDomain saved = participationRepository.save(participationDomain);

        joinEventDTO.setUserId(saved.getId());

        return joinEventDTO;
    }

    public EventDTO findByCodeWhithoutTipsCode(String code) {

        code = code.toUpperCase();

        Optional<EventDomain> optionalEventDomain = eventRepository.findByCode(code);

        if(!optionalEventDomain.isPresent()) {
            log.info("Event not found");
            throw new BadRequestException("Event not found");
        }

        if (optionalEventDomain.get().getTsRemoved() != null){
            log.info("Event is cancelled");
            throw new BadRequestException("Event is cancelled");
        }

        if (optionalEventDomain.get().getTsEnd().isBefore(LocalDateTime.now())){
            String localDateTimeFormat = transformData(optionalEventDomain.get().getTsEnd());
            log.info("Evento encerrado em ".concat(localDateTimeFormat));
            throw new BadRequestException("Evento encerrado em ".concat(localDateTimeFormat));
        }

        if (optionalEventDomain.get().getTsStart().isAfter(LocalDateTime.now())){
            String localDateTimeFormat = transformData(optionalEventDomain.get().getTsEnd());
            log.info("Evento só inicia em ".concat(localDateTimeFormat));
            throw new BadRequestException("Evento só inicia em ".concat(localDateTimeFormat));
        }

        EventDTO eventDTOToReturn = EventDomain.toDTO(optionalEventDomain.get(),tipRepository);

        eventDTOToReturn.getTips().forEach(t->{
            t.setCode(null);
        });
        
        return eventDTOToReturn;
    }

    public EventDTO findByCode(String code) {

        code = code.toUpperCase();

        Optional<EventDomain> optionalEventDomain = eventRepository.findByCode(code);

        if(!optionalEventDomain.isPresent()) {
            log.info("Evento não encontrado");
            throw new BadRequestException("Evento não encontrado");
        }

        if (optionalEventDomain.get().getTsRemoved() != null){
            log.info("Evento Cancelado");
            throw new BadRequestException("Evento Cancelado");
        }

        if (optionalEventDomain.get().getTsEnd().isBefore(LocalDateTime.now())){
            String localDateTimeFormat = transformData(optionalEventDomain.get().getTsEnd());
            log.info("Evento encerrado em ".concat(localDateTimeFormat));
            throw new BadRequestException("Evento encerrado em ".concat(localDateTimeFormat));
        }

        if (optionalEventDomain.get().getTsStart().isAfter(LocalDateTime.now())){
            String localDateTimeFormat = transformData(optionalEventDomain.get().getTsStart());
            log.info("Evento só inicia em ".concat(localDateTimeFormat));
            throw new BadRequestException("Evento só inicia em ".concat(localDateTimeFormat));
        }
        return EventDomain.toDTO(optionalEventDomain.get(),tipRepository);
    }

    public WinDTO win(WinDTO winDTO) {

        Optional<EventDomain> optionalEventDomain = eventRepository.findByCode(winDTO.getEventCode());

        if (!optionalEventDomain.isPresent()){
            log.info("Evento Não Encontrado, tente novamente.");
            throw new BadRequestException("Evento Não Encontrado, tente novamente.");
        }

        if(optionalEventDomain.get().getTsEnd().isBefore(LocalDateTime.now())){
            log.info("Evento já encerrado, agradecemos a participação!");
            throw new BadRequestException("Evento já encerrado, agradecemos a participação!");
        }

        Optional<ParticipationDomain> optionalParticipationDomain = participationRepository.findById(winDTO.getUserId());

        if (!optionalParticipationDomain.isPresent()){
            log.info("Usuário Não Encontrado, tente novamente.");
            throw new BadRequestException("Usuário Não Encontrado, tente novamente.");
        }

        if (optionalParticipationDomain.get().getTsRemoved() != null){
            log.info("Usuário Bloqueado, tente novamente.");
            throw new BadRequestException("Usuário Bloqueado, tente novamente.");
        }

        List<RankingDomain> rankingDomains = rankingRepository.findAllByEventAndParticipation(optionalEventDomain.get(),optionalParticipationDomain.get());

        if (!rankingDomains.isEmpty()){
            return winDTO;
        }

        RankingDomain rankingDomain = new RankingDomain();

        rankingDomain.setEvent(optionalEventDomain.get());
        rankingDomain.setParticipation(optionalParticipationDomain.get());

        rankingRepository.save(rankingDomain);

        return winDTO;
    }
}
