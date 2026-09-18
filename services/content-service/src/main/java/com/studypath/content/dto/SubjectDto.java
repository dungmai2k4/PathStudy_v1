package com.studypath.content.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectDto {
    private UUID id;
    private String name;
    private String code;
    private String description;
    private String icon;
    private String status;
    private Integer displayOrder;
    private Boolean isAvailable;
    private Long skillCount;
}
