package com.studypath.auth.repository;

import com.studypath.auth.domain.StudentProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfileEntity, UUID> {
    Optional<StudentProfileEntity> findByUserId(UUID userId);
}
