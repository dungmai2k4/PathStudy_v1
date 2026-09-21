package com.studypath.payment.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.studypath.common.dto.ApiResponse;
import com.studypath.common.security.UserContext;
import com.studypath.payment.dto.*;
import com.studypath.payment.service.PaymentOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentOrderController {

    private final PaymentOrderService paymentOrderService;

    @PostMapping("/orders")
    public ResponseEntity<ApiResponse<PaymentOrderDto>> createOrder(
            @AuthenticationPrincipal UserContext userContext,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        PaymentOrderDto orderDto = paymentOrderService.createOrder(userContext.getUserId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Tạo đơn hàng VietQR thành công", orderDto));
    }

    @GetMapping("/orders/{orderCode}")
    public ResponseEntity<ApiResponse<PaymentOrderDto>> getOrderDetails(
            @PathVariable("orderCode") String orderCode
    ) {
        PaymentOrderDto orderDto = paymentOrderService.getOrderDetails(orderCode);
        return ResponseEntity.ok(ApiResponse.ok("Lấy chi tiết đơn hàng thành công", orderDto));
    }

    /**
     * Webhook nhận biến động số dư chuyển khoản thực tế.
     * Hỗ trợ chuẩn xác:
     * - SePay (Authorization: Apikey ... hoặc Bearer ...)
     * - Casso (Header: secure-token)
     * - PayOS (Header: X-API-KEY)
     * - URL query param (?token=...)
     * Hỗ trợ cấu trúc payload phẳng (SePay) và lồng nhau (Casso / PayOS data object).
     */
    @PostMapping("/webhook")
    public ResponseEntity<WebhookResponse> handleWebhook(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-API-KEY", required = false) String xApiKey,
            @RequestHeader(value = "secure-token", required = false) String secureToken,
            @RequestParam(value = "token", required = false) String queryToken,
            @RequestBody(required = false) JsonNode payloadNode
    ) {
        WebhookResponse response = paymentOrderService.processWebhook(authHeader, xApiKey, secureToken, queryToken, payloadNode);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/simulate-success")
    public ResponseEntity<ApiResponse<WebhookResponse>> simulatePaymentSuccess(
            @Valid @RequestBody SimulatePaymentRequest request
    ) {
        WebhookResponse response = paymentOrderService.simulatePaymentSuccess(request);
        return ResponseEntity.ok(ApiResponse.ok("Giả lập thanh toán thành công", response));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<PaymentOrderDto>>> getMyOrders(
            @AuthenticationPrincipal UserContext userContext
    ) {
        List<PaymentOrderDto> orders = paymentOrderService.getUserOrders(userContext.getUserId());
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách đơn hàng thành công", orders));
    }
}
