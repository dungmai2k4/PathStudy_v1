package com.studypath.adaptive.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

public class AdaptiveDtos {

    /**
     * Payload for each skill's result from placement test.
     * Client passes this directly to avoid adaptive-service fetching it again.
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillResultPayload {
        private UUID skillId;
        private String skillName;
        private Integer accuracyPercentage; // 0–100
        private String proficiencyLevel;    // NEEDS_IMPROVEMENT, PROFICIENT, MASTERY
        private Integer totalQuestions;
        private Integer correctCount;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GenerateStudyPathRequest {
        private UUID subjectId;
        private UUID studentId;
        private UUID assessmentAttemptId;
        /**
         * Optional: Direct skill breakdown from placement test result.
         * When provided, adaptive-service uses this instead of fetching from assessment-service.
         * This guarantees correct differentiation based on actual assessment results!
         */
        private List<SkillResultPayload> skillBreakdown;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudyPathDto {
        private UUID id;
        private UUID studentId;
        private UUID subjectId;
        private String subjectName;
        private UUID assessmentAttemptId;
        private Integer totalSkills;
        private Integer completedSkills;
        private Integer progressPercentage;
        private String status;
        private List<SkillNodeDto> nodes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillNodeDto {
        private UUID id;
        private UUID skillId;
        private String skillName;
        private UUID moduleId;
        private String moduleName;
        private UUID topicId;
        private Integer sequenceOrder;
        private String status;           // UNLOCKED, LOCKED, COMPLETED, NEEDS_REMEDIATION
        private Integer baselineAccuracy;
        private String proficiencyLevel; // NEEDS_IMPROVEMENT, PROFICIENT, MASTERY
        private String priorityReason;   // Mô tả tại sao kỹ năng này được xếp vị trí này
        private Boolean milestoneTestPassed;
        private Boolean hasRemedialActive;
        private String remedialReason;
        private Integer lessonCount;
        private String lessonOrderJson;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EnrolledSubjectDto {
        private UUID subjectId;
        private String subjectName;
        private String subjectCode;
        private String icon;
        private Integer progressPercentage;
        private Integer totalSkills;
        private Integer completedSkills;
        private String currentSkillName;
        private UUID currentSkillId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UnlockNextSkillRequest {
        private UUID studentId;
        private UUID subjectId;
        private UUID skillId;
        private UUID topicId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UnlockResponse {
        private boolean unlocked;
        private String message;
        private StudyPathDto studyPath;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecordLessonProgressRequest {
        private UUID studentId;
        private UUID topicId;
        private UUID lessonId;
        private Boolean isCompleted;
        private Boolean quizCompleted;
        private Integer quizScore;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LessonProgressDto {
        private UUID lessonId;
        private UUID topicId;
        private Boolean isCompleted;
        private Boolean quizCompleted;
        private Integer quizScore;
        private java.time.Instant completedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopicRemedialRequest {
        private UUID studentId;
        private UUID subjectId;
        private UUID topicId;
        private Integer scorePercentage;
        private List<UUID> weakLessonIds;
        private List<String> weakLessonTitles;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CompleteCourseTestRequest {
        private UUID studentId;
        private UUID subjectId;
        private Integer scorePercentage;
    }
}
