package com.studypath.auth.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPlanDto {
    private UUID id;
    private String code;
    private String name;
    private Integer durationDays;
    private Long priceVnd;
    private String status;
}
