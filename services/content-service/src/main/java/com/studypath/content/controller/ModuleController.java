package com.studypath.content.controller;

import com.studypath.common.dto.ApiResponse;
import com.studypath.content.dto.ModuleDto;
import com.studypath.content.dto.TopicDto;
import com.studypath.content.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/content/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ContentService contentService;

    @GetMapping("/{id}")
    public ApiResponse<ModuleDto> getModuleById(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy chi tiết module thành công", contentService.getModuleById(id));
    }

    @GetMapping("/{id}/topics")
    public ApiResponse<List<TopicDto>> getTopicsByModuleId(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy danh sách topic của module thành công", contentService.getTopicsByModuleId(id));
    }
}
