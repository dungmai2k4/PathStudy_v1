package com.studypath.question.controller;

import com.studypath.common.dto.ApiResponse;
import com.studypath.question.dto.QuestionBankDto;
import com.studypath.question.service.QuestionService;
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
}
