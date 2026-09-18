package com.studypath.auth.config;

import com.studypath.auth.domain.RoleEntity;
import com.studypath.auth.domain.SubscriptionPlanEntity;
import com.studypath.auth.repository.RoleRepository;
import com.studypath.auth.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;

    @Override
    public void run(String... args) {
        initRoles();
        initSubscriptionPlans();
    }

    private void initRoles() {
        List<String> defaultRoles = Arrays.asList("STUDENT", "MANAGER", "ADMIN");
        for (String roleName : defaultRoles) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(RoleEntity.builder().name(roleName).build());
                log.info("Initialized default role: {}", roleName);
            }
        }
    }

    private void initSubscriptionPlans() {
        if (subscriptionPlanRepository.findByCode("PRO_1_MONTH").isEmpty()) {
            subscriptionPlanRepository.save(SubscriptionPlanEntity.builder()
                    .code("PRO_1_MONTH")
                    .name("PathStudy Pro (1 Tháng)")
                    .durationDays(30)
                    .priceVnd(119000L)
                    .status("ACTIVE")
                    .build());
            log.info("Initialized default plan: PRO_1_MONTH");
        }

        if (subscriptionPlanRepository.findByCode("PRO_6_MONTHS").isEmpty()) {
            subscriptionPlanRepository.save(SubscriptionPlanEntity.builder()
                    .code("PRO_6_MONTHS")
                    .name("PathStudy Pro (6 Tháng)")
                    .durationDays(180)
                    .priceVnd(519000L)
                    .status("ACTIVE")
                    .build());
            log.info("Initialized default plan: PRO_6_MONTHS");
        }
    }
}
