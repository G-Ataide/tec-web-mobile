package twm.getpower.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import twm.getpower.dto.EventDTO;
import twm.getpower.dto.JoinEventDTO;
import twm.getpower.dto.RankingDTO;
import twm.getpower.dto.WinDTO;
import twm.getpower.service.EventService;
import twm.getpower.service.RankingService;

import java.util.List;

@RestController
@RequestMapping("ranking")
@Log4j2
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping(path = "/{eventCode}")
    public ResponseEntity<List<RankingDTO>> rankingByCode(@PathVariable("eventCode") String eventCode){
        return new ResponseEntity<>(rankingService.rankingByCode(eventCode), HttpStatus.OK);
    }

}
