package com.studypath.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private UUID userId;
    private String username;
    private String fullName;
    private Integer grade;
    private String className;
    private String status;
    private Instant createdAt;
    private List<String> roles;
    @JsonProperty("isPro")
    private boolean isPro;
    private List<String> activePlanCodes;
}
