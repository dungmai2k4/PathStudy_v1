package com.studypath.question.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateQuestionRequest {
    @NotNull(message = "Question Bank ID is required")
    private UUID questionBankId;

    @NotNull(message = "Skill ID is required")
    private UUID skillId;

    private UUID moduleId;
    private UUID topicId;
    private UUID lessonId;

    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    private String explanation;
    private Integer displayOrder;

    @NotEmpty(message = "Options are required")
    private List<QuestionOptionInput> options;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionOptionInput {
        @NotBlank(message = "Option content is required")
        private String optionContent;
        private Boolean isCorrect;
        private Integer displayOrder;
    }
}
