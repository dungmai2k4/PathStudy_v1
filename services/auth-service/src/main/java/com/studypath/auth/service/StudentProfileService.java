package com.studypath.auth.service;

import com.studypath.auth.domain.AccountEntity;
import com.studypath.auth.domain.RoleEntity;
import com.studypath.auth.domain.StudentProfileEntity;
import com.studypath.auth.domain.UserEntity;
import com.studypath.auth.dto.StudentProfileDto;
import com.studypath.auth.dto.UpdateStudentProfileRequest;
import com.studypath.auth.repository.AccountRepository;
import com.studypath.auth.repository.StudentProfileRepository;
import com.studypath.auth.repository.UserRepository;
import com.studypath.common.exception.AppException;
import com.studypath.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public StudentProfileDto getProfile(UUID userId) {
        AccountEntity account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        StudentProfileEntity profile = studentProfileRepository.findByUserId(userId)
                .orElse(null);

        List<String> roles = user.getRoles().stream().map(RoleEntity::getName).collect(Collectors.toList());
        boolean isPro = authService.isUserPro(userId);

        return StudentProfileDto.builder()
                .userId(userId)
                .username(account.getUsername())
                .grade(profile != null ? profile.getGrade() : null)
                .className(profile != null ? profile.getClassName() : null)
                .roles(roles)
                .isPro(isPro)
                .build();
    }

    @Transactional
    public StudentProfileDto updateProfile(UUID userId, UpdateStudentProfileRequest request) {
        StudentProfileEntity profile = studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> StudentProfileEntity.builder().userId(userId).build());

        if (request.getGrade() != null) {
            profile.setGrade(request.getGrade());
        }
        if (request.getClassName() != null) {
            profile.setClassName(request.getClassName());
        }

        studentProfileRepository.save(profile);

        return getProfile(userId);
    }
}
