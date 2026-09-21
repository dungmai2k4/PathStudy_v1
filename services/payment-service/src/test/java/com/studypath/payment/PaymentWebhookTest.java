package com.studypath.payment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.studypath.payment.dto.WebhookPaymentPayload;
import com.studypath.payment.dto.WebhookResponse;
import com.studypath.payment.repository.PaymentOrderRepository;
import com.studypath.payment.service.PaymentOrderService;
import com.studypath.payment.service.VietQRHelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentWebhookTest {

    @Mock
    private PaymentOrderRepository paymentOrderRepository;

    @Mock
    private VietQRHelper vietQRHelper;

    @Mock
    private RestTemplate restTemplate;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private PaymentOrderService paymentOrderService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(paymentOrderService, "webhookSecureToken", "test_secure_token_123");
        ReflectionTestUtils.setField(paymentOrderService, "authServiceUrl", "http://localhost:8081");
    }

    @Test
    @DisplayName("Parse payload từ SePay (dạng JSON phẳng)")
    void testParseSePayPayload() throws Exception {
        String json = """
            {
                "id": 9271,
                "gateway": "Techcombank",
                "transactionDate": "2026-03-29 15:45:00",
                "accountNumber": "19070027277011",
                "code": null,
                "content": "PS184832 chuyen khoan hoc phi",
                "transferType": "in",
                "transferAmount": 119000,
                "accumulated": 10500000,
                "subAccount": null,
                "referenceCode": "FT24089001",
                "description": "PS184832 chuyen khoan hoc phi"
            }
            """;
        JsonNode rootNode = objectMapper.readTree(json);
        WebhookPaymentPayload payload = paymentOrderService.parsePayload(rootNode);

        assertEquals("Techcombank", payload.getGateway());
        assertEquals("19070027277011", payload.getAccountNumber());
        assertEquals(119000L, payload.getTransferAmount());
        assertEquals("in", payload.getTransferType());
        assertEquals("PS184832 chuyen khoan hoc phi", payload.getContent());
        assertEquals("FT24089001", payload.getReferenceCode());
    }

    @Test
    @DisplayName("Parse payload từ Casso (dạng mảng trong 'data')")
    void testParseCassoPayload() throws Exception {
        String json = """
            {
                "error": 0,
                "data": [
                    {
                        "id": 101,
                        "tid": "FT998877",
                        "description": "PS 234567 DUNG NGUYEN CHUYEN KHOAN",
                        "amount": 519000,
                        "bank_sub_acc_id": "19070027277011",
                        "when": "2026-03-29 16:00:00"
                    }
                ]
            }
            """;
        JsonNode rootNode = objectMapper.readTree(json);
        WebhookPaymentPayload payload = paymentOrderService.parsePayload(rootNode);

        assertEquals("19070027277011", payload.getAccountNumber());
        assertEquals(519000L, payload.getTransferAmount());
        assertEquals("PS 234567 DUNG NGUYEN CHUYEN KHOAN", payload.getContent());
        assertEquals("FT998877", payload.getReferenceCode());
    }

    @Test
    @DisplayName("Parse payload từ PayOS (đối tượng trong 'data')")
    void testParsePayOSPayload() throws Exception {
        String json = """
            {
                "code": "00",
                "desc": "success",
                "data": {
                    "orderCode": 345678,
                    "amount": 1790000,
                    "description": "PS-345678 nang cap pro 1 nam",
                    "accountNumber": "19070027277011",
                    "reference": "POS889911"
                }
            }
            """;
        JsonNode rootNode = objectMapper.readTree(json);
        WebhookPaymentPayload payload = paymentOrderService.parsePayload(rootNode);

        assertEquals("19070027277011", payload.getAccountNumber());
        assertEquals(1790000L, payload.getTransferAmount());
        assertEquals("PS-345678 nang cap pro 1 nam", payload.getContent());
        assertEquals("POS889911", payload.getReferenceCode());
    }

    @Test
    @DisplayName("Trích xuất và chuẩn hóa mã đơn hàng từ nội dung chuyển khoản đa dạng")
    void testExtractOrderCode() {
        assertEquals("PS184832", paymentOrderService.extractOrderCode("PS184832"));
        assertEquals("PS184832", paymentOrderService.extractOrderCode("PS 184832"));
        assertEquals("PS184832", paymentOrderService.extractOrderCode("ps-184832"));
        assertEquals("PS184832", paymentOrderService.extractOrderCode("ps_184832"));
        assertEquals("PS184832", paymentOrderService.extractOrderCode("MBVCB.12345.PS 184832.ND NGUYEN VAN A"));
        assertEquals("PS998877", paymentOrderService.extractOrderCode("Techcombank chuyen khoan PS998877 hoc phi"));

        assertNull(paymentOrderService.extractOrderCode("Chuyen tien khong co ma"));
        assertNull(paymentOrderService.extractOrderCode(""));
        assertNull(paymentOrderService.extractOrderCode(null));
    }

    @Test
    @DisplayName("Kiểm tra sự kiện Ping / Connection test từ dashboard webhook provider")
    void testPingWebhook() throws Exception {
        String pingJson = """
            {
                "event": "ping"
            }
            """;
        JsonNode rootNode = objectMapper.readTree(pingJson);
        WebhookResponse response = paymentOrderService.processWebhook(
                "Bearer test_secure_token_123",
                null,
                null,
                null,
                rootNode
        );

        assertTrue(response.isSuccess());
        assertTrue(response.getMessage().contains("ping received successfully"));
    }

    @Test
    @DisplayName("Từ chối khi Webhook Token không hợp lệ")
    void testInvalidWebhookToken() throws Exception {
        String json = """
            {
                "content": "PS184832",
                "transferAmount": 119000
            }
            """;
        JsonNode rootNode = objectMapper.readTree(json);

        // Header sai token
        WebhookResponse response = paymentOrderService.processWebhook(
                "Bearer wrong_token",
                null,
                null,
                null,
                rootNode
        );
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Unauthorized"));

        // Header thiếu token hoàn toàn
        WebhookResponse responseEmpty = paymentOrderService.processWebhook(
                null,
                null,
                null,
                null,
                rootNode
        );
        assertFalse(responseEmpty.isSuccess());
        assertTrue(responseEmpty.getMessage().contains("Unauthorized"));
    }

    @Test
    @DisplayName("Chấp nhận token qua nhiều định dạng: Apikey, secure-token, X-API-KEY, query token")
    void testTokenFormats() throws Exception {
        String pingJson = "{\"event\":\"ping\"}";
        JsonNode rootNode = objectMapper.readTree(pingJson);

        // 1. SePay: Authorization: Apikey <token>
        WebhookResponse resApikey = paymentOrderService.processWebhook("Apikey test_secure_token_123", null, null, null, rootNode);
        assertTrue(resApikey.isSuccess());

        // 2. PayOS: X-API-KEY
        WebhookResponse resXApiKey = paymentOrderService.processWebhook(null, "test_secure_token_123", null, null, rootNode);
        assertTrue(resXApiKey.isSuccess());

        // 3. Casso: secure-token
        WebhookResponse resSecureToken = paymentOrderService.processWebhook(null, null, "test_secure_token_123", null, rootNode);
        assertTrue(resSecureToken.isSuccess());

        // 4. URL query param (?token=...)
        WebhookResponse resQuery = paymentOrderService.processWebhook(null, null, null, "test_secure_token_123", rootNode);
        assertTrue(resQuery.isSuccess());
    }
}
