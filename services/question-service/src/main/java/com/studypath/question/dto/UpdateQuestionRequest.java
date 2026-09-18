package com.studypath.question.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateQuestionRequest {
    private UUID skillId;
    private UUID moduleId;
    private UUID topicId;

    @NotBlank(message = "Content is required")
    private String content;

    private String difficulty;
    private String explanation;
    private String status;
    private Integer displayOrder;
    private List<CreateQuestionRequest.QuestionOptionInput> options;
}
