package com.studypath.content.controller;

import com.studypath.common.dto.ApiResponse;
import com.studypath.content.dto.CreateLessonRequest;
import com.studypath.content.dto.ExampleDto;
import com.studypath.content.dto.LessonDto;
import com.studypath.content.dto.MiniQuizDto;
import com.studypath.content.service.ContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/content/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final ContentService contentService;

    @GetMapping("/{id}")
    public ApiResponse<LessonDto> getLessonById(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy chi tiết bài học thành công", contentService.getLessonById(id));
    }

    @GetMapping("/{id}/examples")
    public ApiResponse<List<ExampleDto>> getExamplesByLessonId(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy danh sách ví dụ minh họa thành công", contentService.getExamplesByLessonId(id));
    }

    @GetMapping("/{id}/mini-quizzes")
    public ApiResponse<List<MiniQuizDto>> getMiniQuizzesByLessonId(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy bài kiểm tra nhỏ thành công", contentService.getMiniQuizzesByLessonId(id));
    }

    @PostMapping
    public ApiResponse<LessonDto> createLesson(@Valid @RequestBody CreateLessonRequest request) {
        return ApiResponse.ok("Tạo bài học thành công", contentService.createLesson(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<LessonDto> updateLesson(
            @PathVariable("id") UUID id,
            @Valid @RequestBody CreateLessonRequest request
    ) {
        return ApiResponse.ok("Cập nhật bài học thành công", contentService.updateLesson(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteLesson(@PathVariable("id") UUID id) {
        contentService.deleteLesson(id);
        return ApiResponse.ok("Xóa bài học thành công");
    }
}
