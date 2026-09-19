package com.studypath.auth.service;

import com.studypath.auth.domain.SubscriptionPlanEntity;
import com.studypath.auth.domain.UserSubscriptionEntity;
import com.studypath.auth.dto.SubscriptionPlanDto;
import com.studypath.auth.repository.SubscriptionPlanRepository;
import com.studypath.auth.repository.UserSubscriptionRepository;
import com.studypath.common.exception.AppException;
import com.studypath.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionPlanRepository planRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;

    @Transactional(readOnly = true)
    public List<SubscriptionPlanDto> getActivePlans() {
        return planRepository.findAllByStatus("ACTIVE").stream()
                .map(plan -> SubscriptionPlanDto.builder()
                        .id(plan.getId())
                        .code(plan.getCode())
                        .name(plan.getName())
                        .durationDays(plan.getDurationDays())
                        .priceVnd(plan.getPriceVnd())
                        .status(plan.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getActivePlanCodes(UUID userId) {
        return userSubscriptionRepository.findActiveSubscriptions(userId, Instant.now()).stream()
                .map(s -> s.getPlan() != null ? s.getPlan().getCode() : null)
                .filter(java.util.Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    @Transactional
    public UserSubscriptionEntity subscribe(UUID userId, String planCode) {
        return subscribe(userId, planCode, null);
    }

    @Transactional
    public UserSubscriptionEntity subscribe(UUID userId, String planCode, String paymentReference) {
        SubscriptionPlanEntity plan = planRepository.findByCode(planCode)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Subscription plan not found: " + planCode));

        Instant now = Instant.now();
        Instant startDate = now;

        List<UserSubscriptionEntity> currentActive = userSubscriptionRepository.findActiveSubscriptions(userId, now);
        if (!currentActive.isEmpty()) {
            UserSubscriptionEntity latest = currentActive.get(0);
            if (latest.getEndDate().isAfter(now)) {
                startDate = latest.getEndDate();
            }
        }

        Instant endDate = startDate.plus(plan.getDurationDays(), ChronoUnit.DAYS);

        UserSubscriptionEntity subscription = UserSubscriptionEntity.builder()
                .userId(userId)
                .plan(plan)
                .startDate(startDate)
                .endDate(endDate)
                .status("ACTIVE")
                .paymentReference(paymentReference)
                .build();

        return userSubscriptionRepository.save(subscription);
    }
}
