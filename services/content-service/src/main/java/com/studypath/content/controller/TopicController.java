package com.studypath.content.controller;

import com.studypath.common.dto.ApiResponse;
import com.studypath.content.dto.CreateTopicRequest;
import com.studypath.content.dto.LessonDto;
import com.studypath.content.dto.TopicDto;
import com.studypath.content.service.ContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/content/topics")
@RequiredArgsConstructor
public class TopicController {

    private final ContentService contentService;

    @GetMapping("/{id}")
    public ApiResponse<TopicDto> getTopicById(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy chi tiết topic thành công", contentService.getTopicById(id));
    }

    @GetMapping("/{id}/lessons")
    public ApiResponse<List<LessonDto>> getLessonsByTopicId(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy danh sách bài học của topic thành công", contentService.getLessonsByTopicId(id));
    }

    @GetMapping("/{id}/remedial-lessons")
    public ApiResponse<List<LessonDto>> getRemedialLessonsByTopicId(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy danh sách bài học bổ trợ luyện lại thành công", contentService.getRemedialLessonsByTopicId(id));
    }

    @PostMapping
    public ApiResponse<TopicDto> createTopic(@Valid @RequestBody CreateTopicRequest request) {
        return ApiResponse.ok("Tạo topic thành công", contentService.createTopic(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<TopicDto> updateTopic(
            @PathVariable("id") UUID id,
            @Valid @RequestBody CreateTopicRequest request
    ) {
        return ApiResponse.ok("Cập nhật topic thành công", contentService.updateTopic(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteTopic(@PathVariable("id") UUID id) {
        contentService.deleteTopic(id);
        return ApiResponse.ok("Xóa topic thành công");
    }
}
