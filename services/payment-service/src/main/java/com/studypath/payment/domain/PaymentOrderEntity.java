package com.studypath.payment.domain;

import com.studypath.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payment_order", indexes = {
        @Index(name = "idx_payment_order_code", columnList = "order_code", unique = true),
        @Index(name = "idx_payment_order_user", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentOrderEntity extends BaseEntity {

    @Column(name = "order_code", nullable = false, unique = true, length = 50)
    private String orderCode;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "plan_code", nullable = false, length = 50)
    private String planCode;

    @Column(name = "plan_name", nullable = false, length = 100)
    private String planName;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "bank_code", nullable = false, length = 50)
    private String bankCode;

    @Column(name = "account_no", nullable = false, length = 50)
    private String accountNo;

    @Column(name = "account_name", nullable = false, length = 100)
    private String accountName;

    @Column(name = "qr_url", columnDefinition = "TEXT")
    private String qrUrl;

    @Builder.Default
    @Column(name = "status", nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, PAID, CANCELLED, EXPIRED

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Column(name = "transfer_content", length = 255)
    private String transferContent;

    @Column(name = "transfer_amount")
    private Long transferAmount;

    @Column(name = "paid_at")
    private Instant paidAt;
}
