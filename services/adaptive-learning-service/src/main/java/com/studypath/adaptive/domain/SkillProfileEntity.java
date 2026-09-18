package com.studypath.adaptive.domain;

import com.studypath.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "skill_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillProfileEntity extends BaseEntity {

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "subject_id", nullable = false)
    private UUID subjectId;

    @Column(name = "skill_id", nullable = false)
    private UUID skillId;

    @Column(name = "skill_name", nullable = false)
    private String skillName;

    @Column(name = "accuracy_percentage", nullable = false)
    @Builder.Default
    private Integer accuracyPercentage = 0;

    @Column(name = "mastery_level", length = 30)
    private String masteryLevel;
}
