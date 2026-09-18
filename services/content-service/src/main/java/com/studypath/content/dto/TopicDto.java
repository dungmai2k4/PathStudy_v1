package com.studypath.content.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicDto {
    private UUID id;
    private UUID moduleId;
    private String name;
    private String code;
    private String description;
    private Integer displayOrder;
    private String status;
    private List<LessonDto> lessons;
}
