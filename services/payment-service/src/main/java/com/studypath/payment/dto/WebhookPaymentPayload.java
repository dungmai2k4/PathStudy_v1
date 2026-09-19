package com.studypath.payment.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookPaymentPayload {

    private Long id;

    @JsonAlias({"gateway", "bank"})
    private String gateway;

    @JsonAlias({"transactionDate", "created_at"})
    private String transactionDate;

    @JsonAlias({"accountNumber", "account_number"})
    private String accountNumber;

    @JsonAlias({"subAccount", "sub_account"})
    private String subAccount;

    @JsonAlias({"transferType", "transfer_type", "type"})
    private String transferType; // "in" / "out"

    @JsonAlias({"transferAmount", "transfer_amount", "amount"})
    private Long transferAmount;

    @JsonAlias({"accumulated", "balance"})
    private Long accumulated;

    private String code;

    @JsonAlias({"content", "orderCode", "description"})
    private String content;

    @JsonAlias({"referenceCode", "reference_code", "reference", "ref"})
    private String referenceCode;

    private String description;
}
