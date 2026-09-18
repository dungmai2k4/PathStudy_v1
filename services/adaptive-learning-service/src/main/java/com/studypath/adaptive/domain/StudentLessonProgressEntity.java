package com.studypath.adaptive.domain;

import com.studypath.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "student_lesson_progress",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "lesson_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentLessonProgressEntity extends BaseEntity {

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "topic_id", nullable = false)
    private UUID topicId;

    @Column(name = "lesson_id", nullable = false)
    private UUID lessonId;

    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;

    @Column(name = "quiz_completed", nullable = false)
    @Builder.Default
    private Boolean quizCompleted = false;

    @Column(name = "quiz_score")
    @Builder.Default
    private Integer quizScore = 0;

    @Column(name = "completed_at")
    private Instant completedAt;
}
