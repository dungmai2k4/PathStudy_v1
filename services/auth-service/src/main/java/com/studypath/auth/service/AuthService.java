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
import java.util.*;
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

        if (request.getFullName() != null || request.getGrade() != null || request.getClassName() != null) {
            StudentProfileEntity profile = StudentProfileEntity.builder()
                    .userId(user.getId())
                    .fullName(request.getFullName())
                    .grade(request.getGrade())
                    .className(request.getClassName())
                    .build();
            studentProfileRepository.save(profile);
        }

        List<String> roles = user.getRoles().stream().map(RoleEntity::getName).collect(Collectors.toList());

        return UserDto.builder()
                .userId(user.getId())
                .username(account.getUsername())
                .fullName(request.getFullName())
                .grade(request.getGrade())
                .className(request.getClassName())
                .status(account.getStatus())
                .createdAt(account.getCreatedAt())
                .roles(roles)
                .isPro(false)
                .build();
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        AccountEntity account = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, "Invalid username or password"));

        if (!"ACTIVE".equalsIgnoreCase(account.getStatus())) {
            throw new AppException(ErrorCode.ACCOUNT_DISABLED, "Account has been disabled or blocked");
        }

        if (!passwordEncoder.matches(request.getPassword(), account.getPasswordHash())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS, "Invalid username or password");
        }

        UserEntity user = userRepository.findById(account.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<String> roles = user.getRoles().stream().map(RoleEntity::getName).collect(Collectors.toList());

        boolean isPro = isUserPro(user.getId());

        String token = jwtTokenProvider.generateToken(user.getId(), account.getUsername(), roles, isPro);

        StudentProfileEntity profile = studentProfileRepository.findByUserId(user.getId()).orElse(null);

        UserDto userDto = UserDto.builder()
                .userId(user.getId())
                .username(account.getUsername())
                .fullName(profile != null ? profile.getFullName() : null)
                .grade(profile != null ? profile.getGrade() : null)
                .className(profile != null ? profile.getClassName() : null)
                .status(account.getStatus())
                .createdAt(account.getCreatedAt())
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
        List<UserSubscriptionEntity> activeSubs = userSubscriptionRepository.findActiveSubscriptions(user.getId(), Instant.now());
        boolean isPro = !activeSubs.isEmpty();
        List<String> activePlanCodes = activeSubs.stream()
                .map(s -> s.getPlan() != null ? s.getPlan().getCode() : null)
                .filter(java.util.Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        StudentProfileEntity profile = studentProfileRepository.findByUserId(user.getId()).orElse(null);

        return UserDto.builder()
                .userId(user.getId())
                .username(account.getUsername())
                .fullName(profile != null ? profile.getFullName() : null)
                .grade(profile != null ? profile.getGrade() : null)
                .className(profile != null ? profile.getClassName() : null)
                .status(account.getStatus())
                .createdAt(account.getCreatedAt())
                .roles(roles)
                .isPro(isPro)
                .activePlanCodes(activePlanCodes)
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers(String role, String status, String keyword) {
        List<AccountEntity> accounts = accountRepository.findAll();
        if (accounts.isEmpty()) {
            return Collections.emptyList();
        }

        List<UUID> userIds = accounts.stream()
                .map(AccountEntity::getUserId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        Map<UUID, StudentProfileEntity> profileMap = studentProfileRepository.findByUserIdIn(userIds).stream()
                .collect(Collectors.toMap(StudentProfileEntity::getUserId, p -> p, (a, b) -> a));

        Map<UUID, UserEntity> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, u -> u, (a, b) -> a));

        Set<UUID> proUserIds = userSubscriptionRepository.findActiveSubscriptionUserIds(userIds, Instant.now());

        String kw = (keyword != null && !keyword.trim().isEmpty()) ? keyword.toLowerCase().trim() : null;
        String requiredStatus = (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) ? status : null;
        String requiredRole = (role != null && !role.trim().isEmpty() && !role.equalsIgnoreCase("ALL")) ? role.toUpperCase().trim() : null;

        return accounts.stream()
                .filter(acc -> {
                    if (requiredStatus != null && !acc.getStatus().equalsIgnoreCase(requiredStatus)) {
                        return false;
                    }
                    if (kw != null) {
                        boolean matchUsername = acc.getUsername() != null && acc.getUsername().toLowerCase().contains(kw);
                        if (!matchUsername) {
                            StudentProfileEntity p = profileMap.get(acc.getUserId());
                            if (p == null || p.getFullName() == null || !p.getFullName().toLowerCase().contains(kw)) {
                                return false;
                            }
                        }
                    }
                    return true;
                })
                .map(acc -> {
                    UserEntity user = userMap.get(acc.getUserId());
                    if (user == null) return null;

                    List<String> roles = user.getRoles().stream()
                            .map(RoleEntity::getName)
                            .collect(Collectors.toList());

                    if (requiredRole != null && !roles.contains(requiredRole)) {
                        return null;
                    }

                    StudentProfileEntity profile = profileMap.get(acc.getUserId());
                    boolean isPro = proUserIds.contains(acc.getUserId());

                    return UserDto.builder()
                            .userId(user.getId())
                            .username(acc.getUsername())
                            .fullName(profile != null ? profile.getFullName() : null)
                            .grade(profile != null ? profile.getGrade() : null)
                            .className(profile != null ? profile.getClassName() : null)
                            .status(acc.getStatus())
                            .createdAt(acc.getCreatedAt())
                            .roles(roles)
                            .isPro(isPro)
                            .build();
                })
                .filter(Objects::nonNull)
                .sorted((a, b) -> {
                    if (a.getCreatedAt() != null && b.getCreatedAt() != null) {
                        return b.getCreatedAt().compareTo(a.getCreatedAt());
                    }
                    return 0;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(UUID userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        AccountEntity acc = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        StudentProfileEntity profile = studentProfileRepository.findByUserId(userId).orElse(null);
        List<String> roles = user.getRoles().stream().map(RoleEntity::getName).collect(Collectors.toList());
        boolean isPro = isUserPro(userId);

        return UserDto.builder()
                .userId(user.getId())
                .username(acc.getUsername())
                .fullName(profile != null ? profile.getFullName() : null)
                .grade(profile != null ? profile.getGrade() : null)
                .className(profile != null ? profile.getClassName() : null)
                .status(acc.getStatus())
                .createdAt(acc.getCreatedAt())
                .roles(roles)
                .isPro(isPro)
                .build();
    }

    @Transactional
    public UserDto updateUserStatus(UUID userId, UpdateUserStatusRequest request) {
        AccountEntity acc = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        acc.setStatus(request.getStatus().toUpperCase());
        accountRepository.save(acc);
        return getUserById(userId);
    }

    @Transactional
    public UserDto updateUserRole(UUID userId, UpdateUserRoleRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Set<RoleEntity> newRoles = new HashSet<>();
        for (String roleName : request.getRoles()) {
            RoleEntity roleEntity = roleRepository.findByName(roleName.toUpperCase())
                    .orElseGet(() -> roleRepository.save(RoleEntity.builder().name(roleName.toUpperCase()).build()));
            newRoles.add(roleEntity);
        }
        user.setRoles(newRoles);
        userRepository.save(user);

        return getUserById(userId);
    }

    @Transactional
    public UserDto createAdminUser(CreateAdminUserRequest request) {
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS, "Username already taken: " + request.getUsername());
        }

        Set<RoleEntity> roles = new HashSet<>();
        List<String> requestedRoles = (request.getRoles() != null && !request.getRoles().isEmpty())
                ? request.getRoles()
                : Collections.singletonList("STUDENT");

        for (String roleName : requestedRoles) {
            RoleEntity roleEntity = roleRepository.findByName(roleName.toUpperCase())
                    .orElseGet(() -> roleRepository.save(RoleEntity.builder().name(roleName.toUpperCase()).build()));
            roles.add(roleEntity);
        }

        UserEntity user = UserEntity.builder()
                .roles(roles)
                .build();
        user = userRepository.save(user);

        AccountEntity account = AccountEntity.builder()
                .userId(user.getId())
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .status("ACTIVE")
                .build();
        accountRepository.save(account);

        if (request.getFullName() != null || request.getGrade() != null || request.getClassName() != null) {
            StudentProfileEntity profile = StudentProfileEntity.builder()
                    .userId(user.getId())
                    .fullName(request.getFullName())
                    .grade(request.getGrade())
                    .className(request.getClassName())
                    .build();
            studentProfileRepository.save(profile);
        }

        return getUserById(user.getId());
    }

    public boolean isUserPro(UUID userId) {
        List<UserSubscriptionEntity> activeSubs = userSubscriptionRepository.findActiveSubscriptions(userId, Instant.now());
        return !activeSubs.isEmpty();
    }
}
