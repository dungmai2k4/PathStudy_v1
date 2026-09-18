package com.studypath.content.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonDto {
    private UUID id;
    private UUID topicId;
    private UUID skillId;
    private String title;
    private String content;
    private String theorySummary;
    private Boolean isRemedial;
    private String status;
    private Integer displayOrder;
    private List<ExampleDto> examples;
    private List<MiniQuizDto> miniQuizzes;
}
