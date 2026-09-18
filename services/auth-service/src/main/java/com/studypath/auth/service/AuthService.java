package com.studypath.auth.service;

import com.studypath.auth.domain.*;
import com.studypath.auth.dto.*;
import com.studypath.auth.repository.*;
import com.studypath.auth.security.JwtTokenProvider;
import com.studypath.common.exception.AppException;
import com.studypath.common.exception.ErrorCode;
import com.studypath.common.security.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public UserDto register(RegisterRequest request) {
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS, "Username already taken: " + request.getUsername());
        }

        RoleEntity studentRole = roleRepository.findByName("STUDENT")
                .orElseGet(() -> roleRepository.save(RoleEntity.builder().name("STUDENT").build()));

        UserEntity user = UserEntity.builder()
                .roles(new HashSet<>(Collections.singletonList(studentRole)))
                .build();
        user = userRepository.save(user);

        AccountEntity account = AccountEntity.builder()
                .userId(user.getId())
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .status("ACTIVE")
                .build();
        accountRepository.save(account);

        if (request.getGrade() != null || request.getClassName() != null) {
            StudentProfileEntity profile = StudentProfileEntity.builder()
                    .userId(user.getId())
                    .grade(request.getGrade())
                    .className(request.getClassName())
                    .build();
            studentProfileRepository.save(profile);
        }

        List<String> roles = user.getRoles().stream().map(RoleEntity::getName).collect(Collectors.toList());

        return UserDto.builder()
                .userId(user.getId())
                .username(account.getUsername())
                .roles(roles)
                .isPro(false)
                .build();
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        AccountEntity account = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, "Invalid username or password"));

        if (!"ACTIVE".equalsIgnoreCase(account.getStatus())) {
            throw new AppException(ErrorCode.ACCOUNT_DISABLED, "Account has been disabled");
        }

        if (!passwordEncoder.matches(request.getPassword(), account.getPasswordHash())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS, "Invalid username or password");
        }

        UserEntity user = userRepository.findById(account.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<String> roles = user.getRoles().stream().map(RoleEntity::getName).collect(Collectors.toList());

        boolean isPro = isUserPro(user.getId());

        String token = jwtTokenProvider.generateToken(user.getId(), account.getUsername(), roles, isPro);

        UserDto userDto = UserDto.builder()
                .userId(user.getId())
                .username(account.getUsername())
                .roles(roles)
                .isPro(isPro)
                .build();

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getExpirationMs() / 1000)
                .user(userDto)
                .build();
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UserContext userContext) {
        if (userContext == null || userContext.getUserId() == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        AccountEntity account = accountRepository.findByUserId(userContext.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserEntity user = userRepository.findById(userContext.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<String> roles = user.getRoles().stream().map(RoleEntity::getName).collect(Collectors.toList());
        boolean isPro = isUserPro(user.getId());

        return UserDto.builder()
                .userId(user.getId())
                .username(account.getUsername())
                .roles(roles)
                .isPro(isPro)
                .build();
    }

    public boolean isUserPro(UUID userId) {
        List<UserSubscriptionEntity> activeSubs = userSubscriptionRepository.findActiveSubscriptions(userId, Instant.now());
        return !activeSubs.isEmpty();
    }
}
