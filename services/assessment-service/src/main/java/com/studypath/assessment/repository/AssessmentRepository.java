package com.studypath.assessment.repository;

import com.studypath.assessment.domain.AssessmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentRepository extends JpaRepository<AssessmentEntity, UUID> {
    Optional<AssessmentEntity> findBySubjectIdAndType(UUID subjectId, String type);
}
