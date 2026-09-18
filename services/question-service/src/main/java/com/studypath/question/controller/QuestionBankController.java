package com.studypath.question.controller;

import com.studypath.common.dto.ApiResponse;
import com.studypath.question.dto.CreateQuestionBankRequest;
import com.studypath.question.dto.QuestionBankDto;
import com.studypath.question.dto.UpdateQuestionBankRequest;
import com.studypath.question.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/questions/banks")
@RequiredArgsConstructor
public class QuestionBankController {

    private final QuestionService questionService;

    @GetMapping
    public ApiResponse<List<QuestionBankDto>> getQuestionBanks(@RequestParam(name = "subjectId", required = false) UUID subjectId) {
        return ApiResponse.ok("Lấy danh sách ngân hàng câu hỏi thành công", questionService.getQuestionBanks(subjectId));
    }

    @GetMapping("/{id}")
    public ApiResponse<QuestionBankDto> getQuestionBankById(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy chi tiết ngân hàng câu hỏi thành công", questionService.getQuestionBankById(id));
    }

    @PostMapping
    public ApiResponse<QuestionBankDto> createQuestionBank(@Valid @RequestBody CreateQuestionBankRequest request) {
        return ApiResponse.ok("Tạo ngân hàng câu hỏi thành công", questionService.createQuestionBank(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<QuestionBankDto> updateQuestionBank(
            @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateQuestionBankRequest request
    ) {
        return ApiResponse.ok("Cập nhật ngân hàng câu hỏi thành công", questionService.updateQuestionBank(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteQuestionBank(@PathVariable("id") UUID id) {
        questionService.deleteQuestionBank(id);
        return ApiResponse.ok("Xóa ngân hàng câu hỏi thành công");
    }
}
