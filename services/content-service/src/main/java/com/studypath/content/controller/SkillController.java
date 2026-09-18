package com.studypath.content.controller;

import com.studypath.common.dto.ApiResponse;
import com.studypath.content.dto.LessonDto;
import com.studypath.content.dto.SkillDto;
import com.studypath.content.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/content/skills")
@RequiredArgsConstructor
public class SkillController {

    private final ContentService contentService;

    @GetMapping("/{id}")
    public ApiResponse<SkillDto> getSkillById(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy chi tiết kỹ năng thành công", contentService.getSkillById(id));
    }

    @GetMapping("/{id}/lessons")
    public ApiResponse<List<LessonDto>> getLessonsBySkillId(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy danh sách bài học thành công", contentService.getLessonsBySkillId(id));
    }
}
