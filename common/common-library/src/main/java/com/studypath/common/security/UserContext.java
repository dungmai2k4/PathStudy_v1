package com.studypath.common.security;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserContext {
    private UUID userId;
    private String username;
    private List<String> roles;
    private boolean isPro;
}
