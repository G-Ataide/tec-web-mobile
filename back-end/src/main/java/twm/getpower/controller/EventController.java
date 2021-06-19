package twm.getpower.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import twm.getpower.dto.*;
import twm.getpower.service.EventService;

@RestController
@RequestMapping("event")
@Log4j2
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping(path = "/create")
    public ResponseEntity<EventDTO> create(@RequestBody EventDTO eventDTO){
        return new ResponseEntity<>(eventService.save(eventDTO), HttpStatus.CREATED);
    }

    @PostMapping(path = "/join")
    public ResponseEntity<JoinEventDTO> join(@RequestBody JoinEventDTO joinEventDTO){
        return new ResponseEntity<>(eventService.join(joinEventDTO), HttpStatus.OK);
    }

    @GetMapping(path = "/findByCodeWhithoutTipsCode/{code}")
    public ResponseEntity<EventDTO> findByCodeWhithoutTipsCode(@PathVariable("code") String code){
        return new ResponseEntity<>(eventService.findByCodeWhithoutTipsCode(code), HttpStatus.OK);
    }

    @GetMapping(path = "/findByCode/{code}")
    public ResponseEntity<EventDTO> findByCode(@PathVariable("code") String code){
        return new ResponseEntity<>(eventService.findByCode(code), HttpStatus.OK);
    }

    @PostMapping(path = "/win")
    public ResponseEntity<WinDTO> win(@RequestBody WinDTO winDTO){
        return new ResponseEntity<>(eventService.win(winDTO), HttpStatus.OK);
    }

}
