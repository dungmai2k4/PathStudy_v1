package com.studypath.assessment.domain;

import com.studypath.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "assessments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentEntity extends BaseEntity {

    @Column(name = "subject_id", nullable = false)
    private UUID subjectId;

    @Column(name = "module_id")
    private UUID moduleId;

    @Column(name = "topic_id")
    private UUID topicId;

    @Column(name = "skill_id")
    private UUID skillId;

    @Column(nullable = false)
    private String title;

    @Column(name = "assessment_type", nullable = false, length = 30)
    private String type; // PLACEMENT, TOPIC_TEST, SKILL_TEST, COURSE_FINAL_TEST

    @Column(name = "time_limit_minutes", nullable = false)
    @Builder.Default
    private Integer timeLimitMinutes = 12;

    @Column(name = "total_questions", nullable = false)
    @Builder.Default
    private Integer totalQuestions = 12;

    @Column(name = "passing_score_percentage")
    @Builder.Default
    private Integer passingScorePercentage = 60;
}
