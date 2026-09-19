package com.studypath.payment.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookResponse {

    private boolean success;
    private String message;
    private String orderCode;
    private Long amount;
}
