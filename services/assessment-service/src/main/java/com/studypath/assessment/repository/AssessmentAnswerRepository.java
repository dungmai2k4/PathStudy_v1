package com.studypath.assessment.repository;

import com.studypath.assessment.domain.AssessmentAnswerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssessmentAnswerRepository extends JpaRepository<AssessmentAnswerEntity, UUID> {
    List<AssessmentAnswerEntity> findByAttemptId(UUID attemptId);
}
