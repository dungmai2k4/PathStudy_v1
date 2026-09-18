package com.studypath.adaptive.domain;

import com.studypath.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "study_paths")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyPathEntity extends BaseEntity {

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "subject_id", nullable = false)
    private UUID subjectId;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Column(name = "assessment_attempt_id")
    private UUID assessmentAttemptId;

    @Column(name = "total_skills", nullable = false)
    @Builder.Default
    private Integer totalSkills = 0;

    @Column(name = "completed_skills", nullable = false)
    @Builder.Default
    private Integer completedSkills = 0;

    @Column(name = "progress_percentage", nullable = false)
    @Builder.Default
    private Integer progressPercentage = 0;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, COMPLETED
}
