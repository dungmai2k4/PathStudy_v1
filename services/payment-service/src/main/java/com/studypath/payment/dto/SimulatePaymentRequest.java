package com.studypath.payment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulatePaymentRequest {

    @NotBlank(message = "Mã đơn hàng không được để trống")
    private String orderCode;

    private Long amount; // Tùy chọn, nếu không truyền sẽ lấy đúng số tiền đơn hàng

    private String accountNo; // Tùy chọn
}
