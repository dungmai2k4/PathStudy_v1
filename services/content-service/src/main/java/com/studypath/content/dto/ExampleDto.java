package com.studypath.content.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExampleDto {
    private UUID id;
    private UUID lessonId;
    private String title;
    private String content;
    private String explanation;
    private String translation;
    private Integer displayOrder;
}
