package com.studypath.auth.security;

import com.studypath.common.security.JwtUtils;
import com.studypath.common.security.UserContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
    private String secretKey;

    @Value("${app.jwt.expiration-ms:86400000}")
    private long expirationMs;

    public String generateToken(UUID userId, String username, List<String> roles, boolean isPro) {
        return JwtUtils.generateToken(secretKey, expirationMs, userId, username, roles, isPro);
    }

    public boolean validateToken(String token) {
        return JwtUtils.validateToken(secretKey, token);
    }

    public UserContext extractUserContext(String token) {
        return JwtUtils.extractUserContext(secretKey, token);
    }

    public long getExpirationMs() {
        return expirationMs;
    }
}
