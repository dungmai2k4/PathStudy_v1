package com.studypath.auth.repository;

import com.studypath.auth.domain.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, UUID> {
    Optional<AccountEntity> findByUsername(String username);
    boolean existsByUsername(String username);
    Optional<AccountEntity> findByUserId(UUID userId);
}
