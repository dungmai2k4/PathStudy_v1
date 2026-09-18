package com.studypath.question.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionOptionDto {
    private UUID id;
    private UUID questionId;
    private String optionContent;
    private Boolean isCorrect;
    private Integer displayOrder;
}
