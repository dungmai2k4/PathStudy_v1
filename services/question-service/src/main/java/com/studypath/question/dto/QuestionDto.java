package com.studypath.question.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDto {
    private UUID id;
    private UUID questionBankId;
    private UUID topicId;
    private UUID moduleId;
    private UUID skillId;
    private UUID lessonId;
    private String content;
    private String difficulty;
    private String explanation;
    private String status;
    private Integer displayOrder;
    private List<QuestionOptionDto> options;
}
