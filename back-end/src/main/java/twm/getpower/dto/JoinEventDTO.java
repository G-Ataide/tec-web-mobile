package twm.getpower.dto;

import lombok.Data;

@Data
public class JoinEventDTO {
    public Long userId;
    public String userName;
    public String email;
    public String eventCode;
}
