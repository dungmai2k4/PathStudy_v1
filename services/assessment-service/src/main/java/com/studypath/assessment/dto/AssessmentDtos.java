package com.studypath.assessment.dto;

import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class AssessmentDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GeneratePlacementTestRequest {
        private UUID subjectId;
        private UUID studentId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GenerateSkillTestRequest {
        private UUID skillId;
        private String skillName;
        private UUID subjectId;
        private UUID studentId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GenerateTopicTestRequest {
        private UUID topicId;
        private String topicName;
        private UUID subjectId;
        private UUID studentId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GenerateCourseTestRequest {
        private UUID subjectId;
        private UUID studentId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssessmentTestDto {
        private UUID assessmentId;
        private UUID attemptId;
        private String title;
        private String assessmentType;
        private Integer timeLimitMinutes;
        private Integer totalQuestions;
        private List<AssessmentQuestionDto> questions;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssessmentQuestionDto {
        private UUID id;
        private UUID questionId;
        private UUID topicId;
        private UUID skillId;
        private String skillName;
        private String content;
        private String difficulty;
        private Integer displayOrder;
        private List<OptionDto> options;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OptionDto {
        private UUID id;
        private String optionContent;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SubmitAssessmentRequest {
        private List<AnswerItem> answers;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnswerItem {
        private UUID questionId;
        private UUID selectedOptionId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssessmentResultDto {
        private UUID attemptId;
        private UUID assessmentId;
        private String title;
        private String assessmentType;
        private UUID subjectId;
        private UUID topicId;
        private UUID skillId;
        private String skillName;
        private Integer score;
        private Integer totalQuestions;
        private Integer accuracyPercentage;
        private Boolean isPassed;
        private Instant startedAt;
        private Instant submittedAt;
        private List<SkillResultDto> skillBreakdown;
        private List<AnswerDetailDto> answerDetails;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillResultDto {
        private UUID skillId;
        private String skillName;
        private Integer totalQuestions;
        private Integer correctCount;
        private Integer accuracyPercentage;
        private String proficiencyLevel;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnswerDetailDto {
        private UUID questionId;
        private String content;
        private UUID selectedOptionId;
        private UUID correctOptionId;
        private Boolean isCorrect;
        private String explanation;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssessmentAttemptSummaryDto {
        private UUID attemptId;
        private String assessmentType;
        private String title;
        private UUID subjectId;
        private UUID topicId;
        private String topicName;
        private UUID skillId;
        private String skillName;
        private Integer score;
        private Integer totalQuestions;
        private Integer accuracyPercentage;
        private Boolean isPassed;
        private Instant startedAt;
        private Instant submittedAt;
    }
}
