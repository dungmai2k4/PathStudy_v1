package com.studypath.assessment.repository;

import com.studypath.assessment.domain.SkillAssessmentResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SkillAssessmentResultRepository extends JpaRepository<SkillAssessmentResultEntity, UUID> {
    List<SkillAssessmentResultEntity> findByAttemptId(UUID attemptId);
}
