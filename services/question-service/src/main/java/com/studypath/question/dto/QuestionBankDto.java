package com.studypath.question.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionBankDto {
    private UUID id;
    private UUID subjectId;
    private String name;
    private String description;
    private String status;
    private Long questionCount;
}
