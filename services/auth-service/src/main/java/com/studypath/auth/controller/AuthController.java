package com.studypath.auth.controller;

import com.studypath.auth.dto.LoginRequest;
import com.studypath.auth.dto.LoginResponse;
import com.studypath.auth.dto.RegisterRequest;
import com.studypath.auth.dto.UserDto;
import com.studypath.auth.service.AuthService;
import com.studypath.common.dto.ApiResponse;
import com.studypath.common.security.UserContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDto>> register(@Valid @RequestBody RegisterRequest request) {
        UserDto user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration successful", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserContext userContext) {
        UserDto user = authService.getCurrentUser(userContext);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
