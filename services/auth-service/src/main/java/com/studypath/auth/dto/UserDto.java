package com.studypath.auth.dto;

import lombok.*;

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
    private List<String> roles;
    private boolean isPro;
}
