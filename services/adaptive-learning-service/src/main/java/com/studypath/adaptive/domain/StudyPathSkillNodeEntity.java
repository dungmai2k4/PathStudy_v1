package com.studypath.adaptive.domain;

import com.studypath.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "study_path_skill_nodes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyPathSkillNodeEntity extends BaseEntity {

    @Column(name = "study_path_id", nullable = false)
    private UUID studyPathId;

    @Column(name = "skill_id", nullable = false)
    private UUID skillId;

    @Column(name = "skill_name", nullable = false)
    private String skillName;

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder; // 1, 2, 3...

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "LOCKED"; // UNLOCKED, LOCKED, COMPLETED

    @Column(name = "baseline_accuracy")
    @Builder.Default
    private Integer baselineAccuracy = 0;

    /**
     * Proficiency level from placement test:
     * NEEDS_IMPROVEMENT (< 60%), PROFICIENT (60–84%), MASTERY (>= 85%)
     */
    @Column(name = "proficiency_level", length = 30)
    @Builder.Default
    private String proficiencyLevel = "NEEDS_IMPROVEMENT";

    /**
     * Explains why this skill was placed at this position in the roadmap.
     * E.g. "Kỹ năng yếu nhất (0%) – ưu tiên củng cố trước"
     */
    @Column(name = "priority_reason", length = 255)
    private String priorityReason;

    @Column(name = "module_id")
    private UUID moduleId;

    @Column(name = "module_name")
    private String moduleName;

    @Column(name = "topic_id")
    private UUID topicId;

    @Column(name = "has_remedial_active")
    @Builder.Default
    private Boolean hasRemedialActive = false;

    @Column(name = "remedial_reason", length = 500)
    private String remedialReason;

    @Column(name = "milestone_test_passed")
    @Builder.Default
    private Boolean milestoneTestPassed = false;

    @Column(name = "lesson_order_json", columnDefinition = "TEXT")
    private String lessonOrderJson;

    @Column(name = "unlocked_at")
    private Instant unlockedAt;

    @Column(name = "completed_at")
    private Instant completedAt;
}
