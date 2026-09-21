package com.studypath.payment.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class VietQRHelper {

    @Value("${vietqr.bank-id:MB}")
    private String bankId;

    @Value("${vietqr.account-no:18122004210620}")
    private String accountNo;

    @Value("${vietqr.account-name:MAI TIEN DUNG}")
    private String accountName;

    @Value("${vietqr.template:compact2}")
    private String template;

    public String generateQrUrl(Long amount, String orderCode) {
        String encodedAccountName = URLEncoder.encode(accountName, StandardCharsets.UTF_8);
        String encodedInfo = URLEncoder.encode(orderCode, StandardCharsets.UTF_8);

        return String.format(
                "https://img.vietqr.io/image/%s-%s-%s.png?amount=%d&addInfo=%s&accountName=%s",
                bankId,
                accountNo,
                template,
                amount,
                encodedInfo,
                encodedAccountName
        );
    }

    public String getBankId() {
        return bankId;
    }

    public String getAccountNo() {
        return accountNo;
    }

    public String getAccountName() {
        return accountName;
    }
}
