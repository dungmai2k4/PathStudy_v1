package com.studypath.question.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckAnswerRequest {
    private UUID selectedOptionId;
}
