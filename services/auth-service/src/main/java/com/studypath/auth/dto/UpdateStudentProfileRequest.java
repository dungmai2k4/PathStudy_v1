package com.studypath.auth.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateStudentProfileRequest {
    private String fullName;
    private Integer grade;
    private String className;
}
