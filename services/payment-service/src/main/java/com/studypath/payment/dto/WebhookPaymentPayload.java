package com.studypath.payment.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class WebhookPaymentPayload {

    private Long id;

    @JsonAlias({"gateway", "bank", "bankName", "bank_name", "bank_abbreviation"})
    private String gateway;

    @JsonAlias({"transactionDate", "created_at", "when", "transactionDateTime"})
    private String transactionDate;

    @JsonAlias({"accountNumber", "account_number", "bank_sub_acc_id", "subAccId"})
    private String accountNumber;

    @JsonAlias({"subAccount", "sub_account"})
    private String subAccount;

    @JsonAlias({"transferType", "transfer_type", "type"})
    private String transferType; // "in" / "out"

    @JsonAlias({"transferAmount", "transfer_amount", "amount"})
    private Long transferAmount;

    @JsonAlias({"accumulated", "balance", "cusum_balance"})
    private Long accumulated;

    private String code;

    @JsonAlias({"content", "orderCode", "order_code", "description", "remark"})
    private String content;

    @JsonAlias({"referenceCode", "reference_code", "reference", "ref", "tid"})
    private String referenceCode;

    private String description;
}
