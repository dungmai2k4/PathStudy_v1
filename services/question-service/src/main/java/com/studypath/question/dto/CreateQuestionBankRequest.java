package com.studypath.question.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateQuestionBankRequest {
    @NotNull(message = "Subject ID is required")
    private UUID subjectId;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;
}
