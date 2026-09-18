package com.studypath.question.controller;

import com.studypath.common.dto.ApiResponse;
import com.studypath.question.dto.*;
import com.studypath.question.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    // --- Student Public Endpoints (Without Answers) ---

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
        return ApiResponse.ok("Lấy chi tiết câu hỏi thành công", questionService.getQuestionById(id, false));
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

    // --- Manager CMS Endpoints (With Answers & Explanations) ---

    @GetMapping("/manage")
    public ApiResponse<List<QuestionDto>> getQuestionsForManager(
            @RequestParam(name = "questionBankId", required = false) UUID questionBankId,
            @RequestParam(name = "skillId", required = false) UUID skillId,
            @RequestParam(name = "difficulty", required = false) String difficulty
    ) {
        return ApiResponse.ok("Lấy danh sách câu hỏi quản trị thành công",
                questionService.getQuestionsForManager(questionBankId, skillId, difficulty));
    }

    @GetMapping("/manage/{id}")
    public ApiResponse<QuestionDto> getQuestionForManagerById(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy chi tiết câu hỏi quản trị thành công", questionService.getQuestionById(id, true));
    }

    @PostMapping
    public ApiResponse<QuestionDto> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        return ApiResponse.ok("Tạo câu hỏi thành công", questionService.createQuestion(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<QuestionDto> updateQuestion(
            @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateQuestionRequest request
    ) {
        return ApiResponse.ok("Cập nhật câu hỏi thành công", questionService.updateQuestion(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteQuestion(@PathVariable("id") UUID id) {
        questionService.deleteQuestion(id);
        return ApiResponse.ok("Xóa câu hỏi thành công");
    }
}
