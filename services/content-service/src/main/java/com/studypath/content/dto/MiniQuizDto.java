package com.studypath.content.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MiniQuizDto {
    private UUID id;
    private UUID lessonId;
    private String title;
    private String description;
    private String questionsJson;
    private String status;
}
