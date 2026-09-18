package com.studypath.assessment.repository;

import com.studypath.assessment.domain.AssessmentAttemptEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttemptEntity, UUID> {
    List<AssessmentAttemptEntity> findByStudentIdOrderByCreatedAtDesc(UUID studentId);
    List<AssessmentAttemptEntity> findByStudentIdAndAssessmentTypeOrderByCreatedAtDesc(UUID studentId, String assessmentType);
    List<AssessmentAttemptEntity> findByStudentIdAndSkillIdOrderByCreatedAtDesc(UUID studentId, UUID skillId);
    List<AssessmentAttemptEntity> findByStudentIdAndTopicIdOrderByCreatedAtDesc(UUID studentId, UUID topicId);
    List<AssessmentAttemptEntity> findByStudentIdAndSubjectIdAndAssessmentTypeOrderByCreatedAtDesc(
            UUID studentId, UUID subjectId, String assessmentType);
    Optional<AssessmentAttemptEntity> findFirstByStudentIdAndSubjectIdAndAssessmentTypeOrderByCreatedAtDesc(
            UUID studentId, UUID subjectId, String assessmentType);
}
