package com.studypath.question.controller;

import com.studypath.common.dto.ApiResponse;
import com.studypath.question.dto.CheckAnswerRequest;
import com.studypath.question.dto.CheckAnswerResponse;
import com.studypath.question.dto.QuestionDto;
import com.studypath.question.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ApiResponse<List<QuestionDto>> getQuestions(
            @RequestParam(name = "questionBankId", required = false) UUID questionBankId,
            @RequestParam(name = "skillId", required = false) UUID skillId,
            @RequestParam(name = "difficulty", required = false) String difficulty
    ) {
        return ApiResponse.ok("Lấy danh sách câu hỏi thành công",
                questionService.getQuestions(questionBankId, skillId, difficulty));
    }

    @GetMapping("/{id}")
    public ApiResponse<QuestionDto> getQuestionById(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy chi tiết câu hỏi thành công", questionService.getQuestionById(id));
    }

    @GetMapping("/by-topic/{topicId}")
    public ApiResponse<List<QuestionDto>> getQuestionsByTopicId(@PathVariable("topicId") UUID topicId) {
        return ApiResponse.ok("Lấy danh sách câu hỏi theo topic thành công",
                questionService.getQuestionsByTopicId(topicId));
    }

    @GetMapping("/by-subject/{subjectId}")
    public ApiResponse<List<QuestionDto>> getQuestionsBySubjectId(@PathVariable("subjectId") UUID subjectId) {
        return ApiResponse.ok("Lấy danh sách câu hỏi theo môn học thành công",
                questionService.getQuestionsBySubjectId(subjectId));
    }

    @PostMapping("/{id}/check-answer")
    public ApiResponse<CheckAnswerResponse> checkAnswer(
            @PathVariable("id") UUID id,
            @RequestBody CheckAnswerRequest request
    ) {
        return ApiResponse.ok("Kiểm tra đáp án thành công",
                questionService.checkAnswer(id, request.getSelectedOptionId()));
    }
}
