package com.studypath.auth.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRoleRequest {
    @NotEmpty(message = "Roles cannot be empty")
    private List<String> roles;
}
