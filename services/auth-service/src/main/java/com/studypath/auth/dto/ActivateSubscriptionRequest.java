package com.studypath.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivateSubscriptionRequest {

    @NotNull(message = "userId không được để trống")
    private UUID userId;

    @NotBlank(message = "planCode không được để trống")
    private String planCode;

    private String paymentReference;
}
