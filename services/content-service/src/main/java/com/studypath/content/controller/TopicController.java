package com.studypath.content.controller;

import com.studypath.common.dto.ApiResponse;
import com.studypath.content.dto.LessonDto;
import com.studypath.content.dto.TopicDto;
import com.studypath.content.service.ContentService;
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
}
