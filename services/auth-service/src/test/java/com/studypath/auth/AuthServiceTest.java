package com.studypath.auth;

import com.studypath.auth.domain.AccountEntity;
import com.studypath.auth.domain.RoleEntity;
import com.studypath.auth.domain.UserEntity;
import com.studypath.auth.dto.LoginRequest;
import com.studypath.auth.dto.LoginResponse;
import com.studypath.auth.dto.RegisterRequest;
import com.studypath.auth.dto.UserDto;
import com.studypath.auth.repository.AccountRepository;
import com.studypath.auth.repository.RoleRepository;
import com.studypath.auth.repository.StudentProfileRepository;
import com.studypath.auth.repository.UserRepository;
import com.studypath.auth.repository.UserSubscriptionRepository;
import com.studypath.auth.security.JwtTokenProvider;
import com.studypath.auth.service.AuthService;
import com.studypath.common.exception.AppException;
import com.studypath.common.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private UserSubscriptionRepository userSubscriptionRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private UUID userId;
    private RoleEntity studentRole;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        studentRole = RoleEntity.builder().name("STUDENT").build();
    }

    @Test
    void testRegister_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .username("teststudent")
                .password("Password123@")
                .grade(11)
                .className("11A2")
                .build();

        when(accountRepository.existsByUsername("teststudent")).thenReturn(false);
        when(roleRepository.findByName("STUDENT")).thenReturn(Optional.of(studentRole));
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");

        when(userRepository.save(any(UserEntity.class))).thenAnswer(invocation -> {
            UserEntity u = invocation.getArgument(0);
            u.setId(userId);
            return u;
        });

        UserDto result = authService.register(request);

        assertNotNull(result);
        assertEquals("teststudent", result.getUsername());
        assertTrue(result.getRoles().contains("STUDENT"));
        assertFalse(result.isPro());

        verify(accountRepository).save(any(AccountEntity.class));
        verify(studentProfileRepository).save(any());
    }

    @Test
    void testRegister_DuplicateUsername_ThrowsException() {
        RegisterRequest request = RegisterRequest.builder()
                .username("existinguser")
                .password("Password123@")
                .build();

        when(accountRepository.existsByUsername("existinguser")).thenReturn(true);

        AppException ex = assertThrows(AppException.class, () -> authService.register(request));
        assertEquals(ErrorCode.USER_ALREADY_EXISTS, ex.getErrorCode());
    }

    @Test
    void testLogin_Success() {
        LoginRequest request = LoginRequest.builder()
                .username("teststudent")
                .password("Password123@")
                .build();

        AccountEntity account = AccountEntity.builder()
                .userId(userId)
                .username("teststudent")
                .passwordHash("hashed_password")
                .status("ACTIVE")
                .build();

        UserEntity user = UserEntity.builder()
                .roles(Collections.singleton(studentRole))
                .build();
        user.setId(userId);

        when(accountRepository.findByUsername("teststudent")).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("Password123@", "hashed_password")).thenReturn(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(jwtTokenProvider.generateToken(eq(userId), eq("teststudent"), anyList(), eq(false)))
                .thenReturn("mocked.jwt.token");
        when(jwtTokenProvider.getExpirationMs()).thenReturn(86400000L);

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals("teststudent", response.getUser().getUsername());
        assertFalse(response.getUser().isPro());
    }

    @Test
    void testLogin_WrongPassword_ThrowsException() {
        LoginRequest request = LoginRequest.builder()
                .username("teststudent")
                .password("WrongPassword")
                .build();

        AccountEntity account = AccountEntity.builder()
                .userId(userId)
                .username("teststudent")
                .passwordHash("hashed_password")
                .status("ACTIVE")
                .build();

        when(accountRepository.findByUsername("teststudent")).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("WrongPassword", "hashed_password")).thenReturn(false);

        AppException ex = assertThrows(AppException.class, () -> authService.login(request));
        assertEquals(ErrorCode.INVALID_CREDENTIALS, ex.getErrorCode());
    }
}
