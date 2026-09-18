package com.studypath.question.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateQuestionBankRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String description;
    private String status;
}
