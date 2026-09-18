package com.studypath.auth.controller;

import com.studypath.auth.dto.*;
import com.studypath.auth.service.AuthService;
import com.studypath.auth.service.StudentProfileService;
import com.studypath.auth.service.SubscriptionService;
import com.studypath.common.dto.ApiResponse;
import com.studypath.common.security.UserContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;
    private final StudentProfileService studentProfileService;
    private final SubscriptionService subscriptionService;

    // --- Student Profile & Subscription Endpoints ---

    @GetMapping("/me/student-profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getMyProfile(
            @AuthenticationPrincipal UserContext userContext
    ) {
        StudentProfileDto profile = studentProfileService.getProfile(userContext.getUserId());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/me/student-profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> updateMyProfile(
            @AuthenticationPrincipal UserContext userContext,
            @Valid @RequestBody UpdateStudentProfileRequest request
    ) {
        StudentProfileDto profile = studentProfileService.updateProfile(userContext.getUserId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", profile));
    }

    @GetMapping("/subscription/plans")
    public ResponseEntity<ApiResponse<List<SubscriptionPlanDto>>> getSubscriptionPlans() {
        List<SubscriptionPlanDto> plans = subscriptionService.getActivePlans();
        return ResponseEntity.ok(ApiResponse.ok(plans));
    }

    @PostMapping("/me/subscription")
    public ResponseEntity<ApiResponse<String>> subscribe(
            @AuthenticationPrincipal UserContext userContext,
            @Valid @RequestBody SubscribeRequest request
    ) {
        subscriptionService.subscribe(userContext.getUserId(), request.getPlanCode());
        return ResponseEntity.ok(ApiResponse.ok("Subscribed successfully! Pro features unlocked."));
    }

    // --- Admin User Management Endpoints ---

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers(
            @RequestParam(name = "role", required = false) String role,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "keyword", required = false) String keyword
    ) {
        List<UserDto> users = authService.getAllUsers(role, status, keyword);
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách người dùng thành công", users));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable("userId") UUID userId) {
        UserDto user = authService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.ok("Lấy thông tin người dùng thành công", user));
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable("userId") UUID userId,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {
        UserDto user = authService.updateUserStatus(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái người dùng thành công", user));
    }

    @PatchMapping("/{userId}/role")
    public ResponseEntity<ApiResponse<UserDto>> updateUserRole(
            @PathVariable("userId") UUID userId,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        UserDto user = authService.updateUserRole(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật vai trò người dùng thành công", user));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserDto>> createUser(
            @Valid @RequestBody CreateAdminUserRequest request
    ) {
        UserDto user = authService.createAdminUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Tạo tài khoản người dùng thành công", user));
    }
}
