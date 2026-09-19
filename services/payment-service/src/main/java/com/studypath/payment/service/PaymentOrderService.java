package com.studypath.payment.service;

import com.studypath.common.dto.ApiResponse;
import com.studypath.common.exception.AppException;
import com.studypath.common.exception.ErrorCode;
import com.studypath.payment.domain.PaymentOrderEntity;
import com.studypath.payment.dto.*;
import com.studypath.payment.repository.PaymentOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentOrderService {

    private final PaymentOrderRepository paymentOrderRepository;
    private final VietQRHelper vietQRHelper;
    private final RestTemplate restTemplate;

    @Value("${payment.webhook.secure-token:study_path_secure_webhook_token_2026}")
    private String webhookSecureToken;

    @Value("${payment.services.auth-service-url:http://localhost:8081}")
    private String authServiceUrl;

    // Pattern tìm mã đơn dạng PS + số, ví dụ PS184832
    private static final Pattern ORDER_CODE_PATTERN = Pattern.compile("PS[0-9]{6,12}", Pattern.CASE_INSENSITIVE);

    @Transactional
    public PaymentOrderDto createOrder(UUID userId, CreateOrderRequest request) {
        String planCode = request.getPlanCode();

        // 1. Kiểm tra tài khoản đã có gói Pro này đang kích hoạt chưa
        List<String> activePlans = getActivePlanCodesFromAuthService(userId);
        if (activePlans.contains(planCode)) {
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "Bạn hiện đang sử dụng gói dịch vụ này và chưa hết hạn. Chưa thể mua lại lúc này!");
        }

        // 2. Lấy thông tin giá tiền và thời hạn từ danh sách plans
        PlanInfo planInfo = resolvePlanInfo(planCode);

        // 3. Tạo mã đơn hàng duy nhất: PS + 6 chữ số
        String orderCode;
        do {
            long randomSuffix = 100000L + (long) (Math.random() * 900000L);
            orderCode = "PS" + randomSuffix;
        } while (paymentOrderRepository.existsByOrderCode(orderCode));

        // 4. Sinh link ảnh VietQR Techcombank
        String qrUrl = vietQRHelper.generateQrUrl(planInfo.amount, orderCode);

        PaymentOrderEntity order = PaymentOrderEntity.builder()
                .orderCode(orderCode)
                .userId(userId)
                .planCode(planCode)
                .planName(planInfo.name)
                .durationDays(planInfo.durationDays)
                .amount(planInfo.amount)
                .bankCode(vietQRHelper.getBankId())
                .accountNo(vietQRHelper.getAccountNo())
                .accountName(vietQRHelper.getAccountName())
                .qrUrl(qrUrl)
                .status("PENDING")
                .build();

        PaymentOrderEntity saved = paymentOrderRepository.save(order);
        log.info("Tạo đơn hàng thanh toán VietQR thành công: orderCode={}, user={}, amount={}",
                orderCode, userId, planInfo.amount);

        return mapToDto(saved);
    }

    @Transactional
    public PaymentOrderDto getOrderDetails(String orderCode) {
        PaymentOrderEntity order = paymentOrderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy đơn hàng: " + orderCode));

        // Kiểm tra hết hạn sau 5 phút nếu vẫn đang PENDING
        checkAndUpdateExpiration(order);

        return mapToDto(order);
    }

    @Transactional
    public WebhookResponse processWebhook(String authHeader, WebhookPaymentPayload payload) {
        log.info("Nhận webhook biến động số dư: {}", payload);

        // 1. Kiểm tra xác thực Webhook Token nếu có cấu hình
        if (webhookSecureToken != null && !webhookSecureToken.isBlank()) {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (!webhookSecureToken.equals(token)) {
                    log.warn("Webhook token không hợp lệ!");
                    return WebhookResponse.builder()
                            .success(false)
                            .message("Unauthorized webhook token")
                            .build();
                }
            }
        }

        // 2. Bỏ qua nếu giao dịch tiền ra
        if ("out".equalsIgnoreCase(payload.getTransferType())) {
            return WebhookResponse.builder()
                    .success(true)
                    .message("Bỏ qua giao dịch tiền ra (transferType: out)")
                    .build();
        }

        // Kiểm tra tài khoản thụ hưởng
        if (payload.getAccountNumber() != null && !payload.getAccountNumber().isBlank()) {
            if (!payload.getAccountNumber().equals(vietQRHelper.getAccountNo())) {
                log.warn("Sai số tài khoản nhận tiền. Nhận được: {}, Cấu hình: {}",
                        payload.getAccountNumber(), vietQRHelper.getAccountNo());
                return WebhookResponse.builder()
                        .success(false)
                        .message("Tài khoản thụ hưởng không khớp")
                        .build();
            }
        }

        // 3. Trích xuất mã đơn hàng từ nội dung chuyển khoản
        String content = payload.getContent() != null ? payload.getContent() : payload.getDescription();
        if (content == null || content.isBlank()) {
            return WebhookResponse.builder()
                    .success(false)
                    .message("Nội dung chuyển khoản rỗng")
                    .build();
        }

        String orderCode = extractOrderCode(content);
        if (orderCode == null) {
            log.warn("Không tìm thấy mã đơn hàng hợp lệ trong nội dung chuyển khoản: {}", content);
            return WebhookResponse.builder()
                    .success(false)
                    .message("Không tìm thấy mã đơn hàng trong nội dung chuyển khoản")
                    .build();
        }

        PaymentOrderEntity order = paymentOrderRepository.findByOrderCode(orderCode).orElse(null);
        if (order == null) {
            log.warn("Mã đơn hàng {} không tồn tại trong hệ thống!", orderCode);
            return WebhookResponse.builder()
                    .success(false)
                    .orderCode(orderCode)
                    .message("Đơn hàng không tồn tại")
                    .build();
        }

        // Kiểm tra hết hạn 5 phút
        if (checkAndUpdateExpiration(order)) {
            return WebhookResponse.builder()
                    .success(false)
                    .orderCode(orderCode)
                    .message("Đơn hàng đã hết hạn sau 5 phút kể từ lúc tạo!")
                    .build();
        }

        // 4. Kiểm tra trạng thái đơn hàng (chống Replay)
        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            log.info("Đơn hàng {} đã được xử lý trước đó với trạng thái: {}", orderCode, order.getStatus());
            return WebhookResponse.builder()
                    .success(true)
                    .orderCode(orderCode)
                    .amount(order.getAmount())
                    .message("Đơn hàng đã được ghi nhận hoàn tất trước đó")
                    .build();
        }

        // 5. Kiểm tra số tiền chuyển khoản (Chống gian lận chuyển thiếu tiền)
        Long transferredAmount = payload.getTransferAmount();
        if (transferredAmount == null || transferredAmount < order.getAmount()) {
            log.error("CẢNH BÁO GIAN LẬN: Đơn hàng {} yêu cầu {} VNĐ nhưng chỉ nhận được {} VNĐ!",
                    orderCode, order.getAmount(), transferredAmount);
            return WebhookResponse.builder()
                    .success(false)
                    .orderCode(orderCode)
                    .amount(transferredAmount)
                    .message("Số tiền chuyển khoản không đủ (Yêu cầu " + order.getAmount() + " VNĐ, nhận " + transferredAmount + " VNĐ)")
                    .build();
        }

        // 6. Cập nhật trạng thái đơn hàng thành PAID
        order.setStatus("PAID");
        order.setPaidAt(Instant.now());
        order.setTransferAmount(transferredAmount);
        order.setTransferContent(content);
        order.setTransactionReference(payload.getReferenceCode());
        paymentOrderRepository.save(order);

        // 7. Kích hoạt quyền lợi gói PRO bên Auth Service
        activateSubscriptionInAuthService(order.getUserId(), order.getPlanCode(), order.getOrderCode());

        log.info("Xử lý webhook thanh toán thành công cho đơn hàng: {}, số tiền: {}", orderCode, transferredAmount);

        return WebhookResponse.builder()
                .success(true)
                .orderCode(orderCode)
                .amount(transferredAmount)
                .message("Xác nhận thanh toán thành công, đã kích hoạt gói PRO")
                .build();
    }

    @Transactional
    public WebhookResponse simulatePaymentSuccess(SimulatePaymentRequest request) {
        PaymentOrderEntity order = paymentOrderRepository.findByOrderCode(request.getOrderCode())
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy đơn hàng: " + request.getOrderCode()));

        // Kiểm tra hết hạn sau 5 phút
        if (checkAndUpdateExpiration(order)) {
            return WebhookResponse.builder()
                    .success(false)
                    .orderCode(order.getOrderCode())
                    .message("Đơn hàng đã hết hạn sau 5 phút kể từ lúc tạo giao dịch. Vui lòng tạo đơn mới!")
                    .build();
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            return WebhookResponse.builder()
                    .success(true)
                    .orderCode(order.getOrderCode())
                    .amount(order.getAmount())
                    .message("Đơn hàng đã được xác nhận thanh toán trước đó (" + order.getStatus() + ")")
                    .build();
        }

        // Nếu người dùng test cố tình truyền số tiền nhỏ hơn để thử tính năng chống gian lận
        Long testAmount = request.getAmount() != null ? request.getAmount() : order.getAmount();
        if (testAmount < order.getAmount()) {
            // Trả về kết quả thông báo rõ ràng cho frontend thay vì crash unhandled
            log.warn("Kiểm thử gian lận cho đơn hàng {}: Yêu cầu {} nhưng chuyển {}",
                    order.getOrderCode(), order.getAmount(), testAmount);
            return WebhookResponse.builder()
                    .success(false)
                    .orderCode(order.getOrderCode())
                    .amount(testAmount)
                    .message("⚠️ Cảnh báo gian lận: Đơn hàng cần " + order.getAmount() + " VNĐ nhưng chỉ chuyển " + testAmount + " VNĐ. Hệ thống từ chối kích hoạt!")
                    .build();
        }

        order.setStatus("PAID");
        order.setPaidAt(Instant.now());
        order.setTransferAmount(testAmount);
        order.setTransferContent("SIMULATED TRANSFER " + order.getOrderCode());
        order.setTransactionReference("SIM_" + System.currentTimeMillis());
        paymentOrderRepository.save(order);

        activateSubscriptionInAuthService(order.getUserId(), order.getPlanCode(), order.getOrderCode());

        log.info("Giả lập thanh toán thành công cho đơn hàng: {}", order.getOrderCode());

        return WebhookResponse.builder()
                .success(true)
                .orderCode(order.getOrderCode())
                .amount(testAmount)
                .message("Giả lập chuyển khoản thành công! Đơn hàng đã chuyển sang PAID và gói PRO đã được kích hoạt.")
                .build();
    }

    @Transactional(readOnly = true)
    public List<PaymentOrderDto> getUserOrders(UUID userId) {
        return paymentOrderRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(order -> {
                    checkAndUpdateExpiration(order);
                    return mapToDto(order);
                })
                .collect(Collectors.toList());
    }

    private boolean checkAndUpdateExpiration(PaymentOrderEntity order) {
        if ("PENDING".equalsIgnoreCase(order.getStatus())) {
            Instant createdAt = order.getCreatedAt() != null ? order.getCreatedAt() : Instant.now();
            Instant expireTime = createdAt.plus(5, ChronoUnit.MINUTES);
            if (Instant.now().isAfter(expireTime)) {
                order.setStatus("EXPIRED");
                paymentOrderRepository.save(order);
                return true;
            }
        }
        return "EXPIRED".equalsIgnoreCase(order.getStatus());
    }

    private String extractOrderCode(String content) {
        Matcher matcher = ORDER_CODE_PATTERN.matcher(content);
        if (matcher.find()) {
            return matcher.group().toUpperCase();
        }
        return null;
    }

    private List<String> getActivePlanCodesFromAuthService(UUID userId) {
        try {
            String url = authServiceUrl + "/api/v1/users/internal/subscriptions/active?userId=" + userId;
            ResponseEntity<ApiResponse<List<String>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {}
            );
            if (response.getBody() != null && response.getBody().getData() != null) {
                return response.getBody().getData();
            }
        } catch (Exception ex) {
            log.warn("Không thể lấy danh sách active subscriptions từ Auth Service: {}", ex.getMessage());
        }
        return Collections.emptyList();
    }

    private void activateSubscriptionInAuthService(UUID userId, String planCode, String orderCode) {
        try {
            String url = authServiceUrl + "/api/v1/users/internal/subscriptions/activate";
            Map<String, Object> body = new HashMap<>();
            body.put("userId", userId);
            body.put("planCode", planCode);
            body.put("paymentReference", orderCode);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<ApiResponse<String>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<>() {}
            );

            log.info("Gọi kích hoạt subscription sang Auth Service thành công: {}", response.getBody());
        } catch (Exception ex) {
            log.error("Lỗi khi gọi sang Auth Service để kích hoạt subscription cho user {}: {}", userId, ex.getMessage(), ex);
        }
    }

    private static class PlanInfo {
        String name;
        int durationDays;
        long amount;

        PlanInfo(String name, int durationDays, long amount) {
            this.name = name;
            this.durationDays = durationDays;
            this.amount = amount;
        }
    }

    private PlanInfo resolvePlanInfo(String planCode) {
        if ("PRO_6_MONTHS".equalsIgnoreCase(planCode)) {
            return new PlanInfo("PathStudy Pro (6 Tháng)", 180, 519000L);
        } else if ("PRO_1_MONTH".equalsIgnoreCase(planCode) || "PRO_MONTHLY".equalsIgnoreCase(planCode)) {
            return new PlanInfo("PathStudy Pro (1 Tháng)", 30, 119000L);
        } else if ("PRO_YEARLY".equalsIgnoreCase(planCode)) {
            return new PlanInfo("PathStudy Pro 1 Năm", 365, 1790000L);
        } else {
            return new PlanInfo("PathStudy Pro (1 Tháng)", 30, 119000L);
        }
    }

    private PaymentOrderDto mapToDto(PaymentOrderEntity entity) {
        return PaymentOrderDto.builder()
                .id(entity.getId())
                .orderCode(entity.getOrderCode())
                .userId(entity.getUserId())
                .planCode(entity.getPlanCode())
                .planName(entity.getPlanName())
                .durationDays(entity.getDurationDays())
                .amount(entity.getAmount())
                .bankCode(entity.getBankCode())
                .accountNo(entity.getAccountNo())
                .accountName(entity.getAccountName())
                .qrUrl(entity.getQrUrl())
                .status(entity.getStatus())
                .transactionReference(entity.getTransactionReference())
                .paidAt(entity.getPaidAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
