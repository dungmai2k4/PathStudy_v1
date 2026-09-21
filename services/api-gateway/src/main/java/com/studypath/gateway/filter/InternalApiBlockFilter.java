package com.studypath.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

/**
 * Filter chặn toàn bộ các yêu cầu từ bên ngoài Internet gọi vào các endpoint nội bộ (/internal/)
 * Đảm bảo các API như kích hoạt subscription nội bộ không thể bị bypass qua Gateway.
 */
@Component
public class InternalApiBlockFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        if (path != null && (path.contains("/internal/") || path.endsWith("/internal"))) {
            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
            exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

            String errorMessage = "{\"status\":403,\"error\":\"Forbidden\",\"message\":\"Truy cập endpoint nội bộ (/internal/) qua Gateway bị từ chối vì lý do bảo mật!\"}";
            byte[] bytes = errorMessage.getBytes(StandardCharsets.UTF_8);
            DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);

            return exchange.getResponse().writeWith(Mono.just(buffer));
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        // Chạy đầu tiên để chặn ngay trước khi route vào microservices bên trong
        return -1;
    }
}
