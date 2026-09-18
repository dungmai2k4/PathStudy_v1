package com.studypath.auth.controller;

import com.studypath.auth.dto.StudentProfileDto;
import com.studypath.auth.dto.SubscribeRequest;
import com.studypath.auth.dto.SubscriptionPlanDto;
import com.studypath.auth.dto.UpdateStudentProfileRequest;
import com.studypath.auth.service.StudentProfileService;
import com.studypath.auth.service.SubscriptionService;
import com.studypath.common.dto.ApiResponse;
import com.studypath.common.security.UserContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final StudentProfileService studentProfileService;
    private final SubscriptionService subscriptionService;

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
}
