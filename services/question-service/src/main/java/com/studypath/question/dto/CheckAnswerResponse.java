package com.studypath.question.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckAnswerResponse {
    @JsonProperty("isCorrect")
    private boolean isCorrect;
    private UUID selectedOptionId;
    private UUID correctOptionId;
    private String explanation;
}

