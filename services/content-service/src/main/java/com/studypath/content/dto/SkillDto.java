package com.studypath.content.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDto {
    private UUID id;
    private UUID subjectId;
    private String name;
    private String code;
    private String description;
    private Integer priority;
    private String status;
    private Integer displayOrder;
    private Long lessonCount;
}
