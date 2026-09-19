package com.studypath.payment.dto;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentOrderDto {

    private UUID id;
    private String orderCode;
    private UUID userId;
    private String planCode;
    private String planName;
    private Integer durationDays;
    private Long amount;
    private String bankCode;
    private String accountNo;
    private String accountName;
    private String qrUrl;
    private String status;
    private String transactionReference;
    private Instant paidAt;
    private Instant createdAt;
}
