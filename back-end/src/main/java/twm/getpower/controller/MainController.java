package twm.getpower.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import twm.getpower.dto.RankingDTO;
import twm.getpower.service.RankingService;

import java.util.List;

@RestController
@Log4j2
@RequiredArgsConstructor
public class MainController {

    @GetMapping()
    public ResponseEntity<String> rankingByCode(){
        return new ResponseEntity<>("ok", HttpStatus.OK);
    }

}
