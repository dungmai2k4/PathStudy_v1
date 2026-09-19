package com.studypath.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileDto {
    private UUID userId;
    private String username;
    private String fullName;
    private Integer grade;
    private String className;
    private List<String> roles;
    @JsonProperty("isPro")
    private boolean isPro;
}
