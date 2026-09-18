package com.studypath.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class JwtUtils {

    public static String generateToken(
            String secretKey,
            long expirationMs,
            UUID userId,
            String username,
            List<String> roles,
            boolean isPro
    ) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(username)
                .claim("userId", userId.toString())
                .claim("roles", roles)
                .claim("isPro", isPro)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public static boolean validateToken(String secretKey, String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    @SuppressWarnings("unchecked")
    public static UserContext extractUserContext(String secretKey, String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String userIdStr = claims.get("userId", String.class);
        UUID userId = userIdStr != null ? UUID.fromString(userIdStr) : null;
        String username = claims.getSubject();
        List<String> roles = claims.get("roles", List.class);
        Boolean isPro = claims.get("isPro", Boolean.class);

        return UserContext.builder()
                .userId(userId)
                .username(username)
                .roles(roles != null ? roles : Collections.emptyList())
                .isPro(Boolean.TRUE.equals(isPro))
                .build();
    }
}
