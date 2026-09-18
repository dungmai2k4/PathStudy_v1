package com.studypath.auth.config;

import com.studypath.auth.domain.*;
import com.studypath.auth.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initRoles();
        initSubscriptionPlans();
        initDefaultAccounts();
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

    private void initDefaultAccounts() {
        // Seed default Admin
        if (!accountRepository.existsByUsername("admin")) {
            RoleEntity adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(RoleEntity.builder().name("ADMIN").build()));

            UserEntity adminUser = UserEntity.builder()
                    .roles(new HashSet<>(Collections.singletonList(adminRole)))
                    .build();
            adminUser = userRepository.save(adminUser);

            AccountEntity adminAccount = AccountEntity.builder()
                    .userId(adminUser.getId())
                    .username("admin")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .status("ACTIVE")
                    .build();
            accountRepository.save(adminAccount);

            StudentProfileEntity adminProfile = StudentProfileEntity.builder()
                    .userId(adminUser.getId())
                    .fullName("System Administrator")
                    .grade(12)
                    .className("ADMIN")
                    .build();
            studentProfileRepository.save(adminProfile);
            log.info("Initialized default admin account: admin / Admin@123");
        }

        // Seed default Manager
        if (!accountRepository.existsByUsername("manager")) {
            RoleEntity managerRole = roleRepository.findByName("MANAGER")
                    .orElseGet(() -> roleRepository.save(RoleEntity.builder().name("MANAGER").build()));

            UserEntity managerUser = UserEntity.builder()
                    .roles(new HashSet<>(Collections.singletonList(managerRole)))
                    .build();
            managerUser = userRepository.save(managerUser);

            AccountEntity managerAccount = AccountEntity.builder()
                    .userId(managerUser.getId())
                    .username("manager")
                    .passwordHash(passwordEncoder.encode("Manager@123"))
                    .status("ACTIVE")
                    .build();
            accountRepository.save(managerAccount);

            StudentProfileEntity managerProfile = StudentProfileEntity.builder()
                    .userId(managerUser.getId())
                    .fullName("Academic Content Manager")
                    .grade(12)
                    .className("MANAGER")
                    .build();
            studentProfileRepository.save(managerProfile);
            log.info("Initialized default manager account: manager / Manager@123");
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
