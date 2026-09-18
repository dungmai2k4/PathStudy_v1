package com.studypath.assessment.domain;

import com.studypath.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "assessment_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentAttemptEntity extends BaseEntity {

    @Column(name = "assessment_id", nullable = false)
    private UUID assessmentId;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "subject_id", nullable = false)
    private UUID subjectId;

    @Column(name = "topic_id")
    private UUID topicId;

    @Column(name = "topic_name")
    private String topicName;

    @Column(name = "skill_id")
    private UUID skillId;

    @Column(name = "skill_name")
    private String skillName;

    @Column(name = "assessment_type", nullable = false, length = 30)
    private String assessmentType; // PLACEMENT, TOPIC_TEST, SKILL_TEST, COURSE_FINAL_TEST

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Column(name = "score")
    @Builder.Default
    private Integer score = 0;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "accuracy_percentage")
    @Builder.Default
    private Integer accuracyPercentage = 0;

    @Column(name = "is_passed")
    @Builder.Default
    private Boolean isPassed = false;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED
}
