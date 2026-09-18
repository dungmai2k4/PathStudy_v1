package com.studypath.assessment.domain;

import com.studypath.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "assessment_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentQuestionEntity extends BaseEntity {

    @Column(name = "assessment_id", nullable = false)
    private UUID assessmentId;

    @Column(name = "question_id", nullable = false)
    private UUID questionId;

    @Column(name = "skill_id", nullable = false)
    private UUID skillId;

    @Column(name = "skill_name")
    private String skillName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(length = 20)
    private String difficulty;

    @Column(name = "options_json", columnDefinition = "TEXT", nullable = false)
    private String optionsJson;

    @Column(name = "correct_option_id", nullable = false)
    private UUID correctOptionId;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
