package com.studypath.assessment.repository;

import com.studypath.assessment.domain.AssessmentQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestionEntity, UUID> {
    List<AssessmentQuestionEntity> findByAssessmentIdOrderByDisplayOrderAsc(UUID assessmentId);
    void deleteByAssessmentId(UUID assessmentId);
}
