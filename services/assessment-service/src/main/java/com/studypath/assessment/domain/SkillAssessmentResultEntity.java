package com.studypath.assessment.domain;

import com.studypath.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "skill_assessment_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillAssessmentResultEntity extends BaseEntity {

    @Column(name = "attempt_id", nullable = false)
    private UUID attemptId;

    @Column(name = "skill_id", nullable = false)
    private UUID skillId;

    @Column(name = "skill_name", nullable = false)
    private String skillName;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "correct_count", nullable = false)
    private Integer correctCount;

    @Column(name = "accuracy_percentage", nullable = false)
    private Integer accuracyPercentage;

    @Column(name = "proficiency_level", length = 30)
    private String proficiencyLevel; // NEEDS_IMPROVEMENT (< 60%), PROFICIENT (60-84%), MASTERY (>= 85%)
}
