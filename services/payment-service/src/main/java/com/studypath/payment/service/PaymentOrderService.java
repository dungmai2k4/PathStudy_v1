package com.studypath.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper;

    @Value("${payment.webhook.secure-token:study_path_secure_webhook_token_2026}")
    private String webhookSecureToken;

    @Value("${payment.services.auth-service-url:http://localhost:8081}")
    private String authServiceUrl;

    // Pattern nhận diện mã đơn hàng: PS184832, PS 184832, PS-184832, PS_184832
    private static final Pattern ORDER_CODE_PATTERN = Pattern.compile("PS[\\s\\-_]?([0-9]{6,12})", Pattern.CASE_INSENSITIVE);

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
                .transferContent(orderCode)
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

    /**
     * Xử lý Webhook biến động số dư thực tế từ ngân hàng / bên thứ 3 (SePay, Casso, PayOS).
     */
    @Transactional
    public WebhookResponse processWebhook(
            String authHeader,
            String xApiKey,
            String secureToken,
            String queryToken,
            JsonNode payloadNode
    ) {
        log.info("Nhận Webhook từ cổng thanh toán. Headers: Auth={}, X-API-KEY={}, secure-token={}, queryToken={}",
                authHeader != null ? "[CÓ]" : "[KHÔNG]",
                xApiKey != null ? "[CÓ]" : "[KHÔNG]",
                secureToken != null ? "[CÓ]" : "[KHÔNG]",
                queryToken != null ? "[CÓ]" : "[KHÔNG]");

        // 1. Xác thực Webhook Token bảo mật
        if (!isValidWebhookToken(authHeader, xApiKey, secureToken, queryToken)) {
            log.warn("Cảnh báo: Webhook token không hợp lệ hoặc bị thiếu!");
            return WebhookResponse.builder()
                    .success(false)
                    .message("Unauthorized: Webhook token không hợp lệ")
                    .build();
        }

        // 2. Parse payload đa định dạng (SePay phẳng, Casso mảng data, PayOS đối tượng data)
        WebhookPaymentPayload payload = parsePayload(payloadNode);
        log.info("Dữ liệu webhook đã chuẩn hóa: Gateway={}, STK={}, Số tiền={}, Nội dung='{}', Ref={}",
                payload.getGateway(), payload.getAccountNumber(), payload.getTransferAmount(),
                payload.getContent(), payload.getReferenceCode());

        // 3. Kiểm tra nếu là sự kiện Ping / Test Webhook từ dashboard nhà cung cấp
        if (isPingOrTest(payloadNode, payload)) {
            log.info("Xử lý thành công Webhook Ping / Test connection từ nhà cung cấp.");
            return WebhookResponse.builder()
                    .success(true)
                    .message("Webhook connection test / ping received successfully")
                    .build();
        }

        // 4. Bỏ qua giao dịch tiền ra (transferType: out)
        if ("out".equalsIgnoreCase(payload.getTransferType())) {
            return WebhookResponse.builder()
                    .success(true)
                    .message("Bỏ qua giao dịch tiền ra (transferType: out)")
                    .build();
        }

        // 5. Kiểm tra tài khoản thụ hưởng nhận tiền
        if (!isMatchingAccountNumber(payload.getAccountNumber())) {
            log.warn("Tài khoản thụ hưởng không khớp! Nhận được: {}, Cấu hình: {}",
                    payload.getAccountNumber(), vietQRHelper.getAccountNo());
            return WebhookResponse.builder()
                    .success(false)
                    .message("Tài khoản thụ hưởng không khớp")
                    .build();
        }

        // 6. Trích xuất mã đơn hàng từ nội dung chuyển khoản
        String content = payload.getContent();
        if (content == null || content.isBlank()) {
            return WebhookResponse.builder()
                    .success(false)
                    .message("Nội dung chuyển khoản rỗng, không thể tìm thấy mã đơn hàng")
                    .build();
        }

        String orderCode = extractOrderCode(content);
        if (orderCode == null) {
            log.warn("Không tìm thấy mã đơn hàng hợp lệ (dạng PSxxxxxx) trong nội dung: '{}'", content);
            return WebhookResponse.builder()
                    .success(false)
                    .message("Không tìm thấy mã đơn hàng hợp lệ trong nội dung chuyển khoản")
                    .build();
        }

        // 7. Tra cứu đơn hàng trong hệ thống
        PaymentOrderEntity order = paymentOrderRepository.findByOrderCode(orderCode).orElse(null);
        if (order == null) {
            log.warn("Mã đơn hàng {} không tồn tại trong hệ thống!", orderCode);
            return WebhookResponse.builder()
                    .success(false)
                    .orderCode(orderCode)
                    .message("Đơn hàng không tồn tại: " + orderCode)
                    .build();
        }

        // 8. Kiểm tra thời hạn hiệu lực đơn hàng (5 phút)
        if (checkAndUpdateExpiration(order)) {
            log.warn("Đơn hàng {} đã hết hạn thanh toán!", orderCode);
            return WebhookResponse.builder()
                    .success(false)
                    .orderCode(orderCode)
                    .message("Đơn hàng đã hết hạn sau 5 phút kể từ lúc tạo!")
                    .build();
        }

        // 9. Kiểm tra chống Replay Attack (nếu đã xử lý trước đó)
        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            log.info("Đơn hàng {} đã được ghi nhận trước đó với trạng thái: {}", orderCode, order.getStatus());
            return WebhookResponse.builder()
                    .success(true)
                    .orderCode(orderCode)
                    .amount(order.getAmount())
                    .message("Đơn hàng đã được xác nhận thanh toán trước đó (" + order.getStatus() + ")")
                    .build();
        }

        // 10. Chống gian lận chuyển thiếu tiền
        Long transferredAmount = payload.getTransferAmount();
        if (transferredAmount == null || transferredAmount < order.getAmount()) {
            log.error("CẢNH BÁO GIAN LẬN: Đơn hàng {} yêu cầu {} VNĐ nhưng nhận được {} VNĐ!",
                    orderCode, order.getAmount(), transferredAmount);
            return WebhookResponse.builder()
                    .success(false)
                    .orderCode(orderCode)
                    .amount(transferredAmount)
                    .message("Số tiền chuyển khoản không đủ (Yêu cầu " + order.getAmount() + " VNĐ, nhận " + transferredAmount + " VNĐ)")
                    .build();
        }

        // 11. Cập nhật trạng thái đơn hàng sang PAID
        order.setStatus("PAID");
        order.setPaidAt(Instant.now());
        order.setTransferAmount(transferredAmount);
        order.setTransferContent(content);
        order.setTransactionReference(payload.getReferenceCode());
        paymentOrderRepository.save(order);

        // 12. Kích hoạt quyền lợi gói PRO bên Auth Service
        activateSubscriptionInAuthService(order.getUserId(), order.getPlanCode(), order.getOrderCode());

        log.info("Xử lý Webhook thanh toán thành công! Đơn: {}, Số tiền: {} VNĐ, User: {}",
                orderCode, transferredAmount, order.getUserId());

        return WebhookResponse.builder()
                .success(true)
                .orderCode(orderCode)
                .amount(transferredAmount)
                .message("Xác nhận thanh toán thành công, đã kích hoạt gói PRO")
                .build();
    }

    /**
     * Tương thích ngược với các caller cũ truyền trực tiếp DTO.
     */
    @Transactional
    public WebhookResponse processWebhook(String authHeader, WebhookPaymentPayload payload) {
        JsonNode node = objectMapper.valueToTree(payload != null ? payload : new WebhookPaymentPayload());
        return processWebhook(authHeader, null, null, null, node);
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

        Long testAmount = request.getAmount() != null ? request.getAmount() : order.getAmount();
        if (testAmount < order.getAmount()) {
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

    /**
     * Trích xuất mã đơn hàng chuẩn hóa (luôn dạng PS + 6-12 chữ số),
     * tự động loại bỏ khoảng trắng, dấu gạch ngang do ngân hàng hoặc người dùng thêm vào.
     */
    public String extractOrderCode(String content) {
        if (content == null || content.isBlank()) {
            return null;
        }
        Matcher matcher = ORDER_CODE_PATTERN.matcher(content);
        if (matcher.find()) {
            return "PS" + matcher.group(1);
        }
        return null;
    }

    /**
     * Kiểm tra số tài khoản thụ hưởng, bỏ qua dấu chấm, gạch nối hoặc khoảng trắng.
     */
    private boolean isMatchingAccountNumber(String receivedAccount) {
        if (receivedAccount == null || receivedAccount.isBlank()) {
            return true; // Không kiểm tra nếu webhook không cung cấp trường này
        }
        String cleanReceived = receivedAccount.replaceAll("[^0-9a-zA-Z]", "");
        String configured = vietQRHelper.getAccountNo();
        if (configured == null || configured.isBlank()) {
            return true;
        }
        String cleanConfig = configured.replaceAll("[^0-9a-zA-Z]", "");
        return cleanReceived.equalsIgnoreCase(cleanConfig);
    }

    /**
     * Xác thực Webhook Token hỗ trợ SePay (Apikey), Casso (secure-token), PayOS (X-API-KEY), query param.
     */
    private boolean isValidWebhookToken(String authHeader, String xApiKey, String secureToken, String queryToken) {
        if (webhookSecureToken == null || webhookSecureToken.isBlank()) {
            return true; // Bỏ qua nếu không cấu hình token bí mật
        }

        // 1. Kiểm tra header Authorization (Bearer hoặc Apikey)
        if (authHeader != null && !authHeader.isBlank()) {
            String token = authHeader.trim();
            if (token.regionMatches(true, 0, "Bearer ", 0, 7)) {
                token = token.substring(7).trim();
            } else if (token.regionMatches(true, 0, "Apikey ", 0, 7)) {
                token = token.substring(7).trim();
            }
            if (webhookSecureToken.equals(token)) {
                return true;
            }
        }

        // 2. Kiểm tra header X-API-KEY
        if (xApiKey != null && webhookSecureToken.equals(xApiKey.trim())) {
            return true;
        }

        // 3. Kiểm tra header secure-token (Casso)
        if (secureToken != null && webhookSecureToken.equals(secureToken.trim())) {
            return true;
        }

        // 4. Kiểm tra URL Query param (?token=...)
        if (queryToken != null && webhookSecureToken.equals(queryToken.trim())) {
            return true;
        }

        return false;
    }

    /**
     * Phát hiện sự kiện Ping / Test Webhook từ dashboard bên thứ 3.
     */
    private boolean isPingOrTest(JsonNode rootNode, WebhookPaymentPayload payload) {
        if (rootNode != null) {
            if (rootNode.has("event") && "ping".equalsIgnoreCase(rootNode.get("event").asText())) return true;
            if (rootNode.has("type") && "ping".equalsIgnoreCase(rootNode.get("type").asText())) return true;
            if (rootNode.has("test") && rootNode.get("test").asBoolean(false)) return true;
        }
        if (payload != null && payload.getContent() != null) {
            String c = payload.getContent().trim().toUpperCase();
            if ("PING".equals(c) || "TEST".equals(c) || "WEBHOOK_TEST".equals(c)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Chuẩn hóa payload từ bất kỳ nhà cung cấp nào thành WebhookPaymentPayload thống nhất.
     */
    public WebhookPaymentPayload parsePayload(JsonNode rootNode) {
        if (rootNode == null || rootNode.isNull()) {
            return new WebhookPaymentPayload();
        }

        JsonNode itemNode = rootNode;
        if (rootNode.has("data")) {
            JsonNode dataNode = rootNode.get("data");
            if (dataNode.isArray() && !dataNode.isEmpty()) {
                itemNode = dataNode.get(0); // Casso gửi danh sách giao dịch
            } else if (dataNode.isObject()) {
                itemNode = dataNode; // PayOS gửi đối tượng lồng nhau
            }
        } else if (rootNode.isArray() && !rootNode.isEmpty()) {
            itemNode = rootNode.get(0);
        }

        String accountNumber = getFirstText(itemNode, "accountNumber", "account_number", "bank_sub_acc_id", "subAccId", "subAccount", "sub_account");
        Long transferAmount = getFirstLong(itemNode, "transferAmount", "transfer_amount", "amount");
        String transferType = getFirstText(itemNode, "transferType", "transfer_type", "type");
        if (transferType == null || transferType.isBlank()) {
            transferType = "in";
        }
        String content = getFirstText(itemNode, "content", "description", "orderCode", "order_code", "remark");
        String referenceCode = getFirstText(itemNode, "referenceCode", "reference_code", "reference", "ref", "tid", "id");
        String gateway = getFirstText(itemNode, "gateway", "bank", "bankName", "bank_name", "bank_abbreviation");
        String transactionDate = getFirstText(itemNode, "transactionDate", "created_at", "when", "transactionDateTime");

        return WebhookPaymentPayload.builder()
                .accountNumber(accountNumber)
                .transferAmount(transferAmount)
                .transferType(transferType)
                .content(content)
                .description(content)
                .referenceCode(referenceCode)
                .gateway(gateway)
                .transactionDate(transactionDate)
                .build();
    }

    private String getFirstText(JsonNode node, String... fieldNames) {
        for (String fieldName : fieldNames) {
            if (node.has(fieldName) && !node.get(fieldName).isNull()) {
                String text = node.get(fieldName).asText();
                if (text != null && !text.isBlank()) {
                    return text.trim();
                }
            }
        }
        return null;
    }

    private Long getFirstLong(JsonNode node, String... fieldNames) {
        for (String fieldName : fieldNames) {
            if (node.has(fieldName) && !node.get(fieldName).isNull()) {
                JsonNode valNode = node.get(fieldName);
                if (valNode.isNumber()) {
                    return valNode.asLong();
                }
                try {
                    String str = valNode.asText().replaceAll("[^0-9]", "");
                    if (!str.isBlank()) {
                        return Long.parseLong(str);
                    }
                } catch (NumberFormatException ignored) {}
            }
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
                .transferContent(entity.getTransferContent())
                .expectedTransferContent(entity.getTransferContent())
                .transactionReference(entity.getTransactionReference())
                .paidAt(entity.getPaidAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
