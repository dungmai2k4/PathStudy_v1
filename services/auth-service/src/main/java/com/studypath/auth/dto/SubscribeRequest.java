package com.studypath.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscribeRequest {

    @NotBlank(message = "Plan code cannot be blank")
    private String planCode;
}
