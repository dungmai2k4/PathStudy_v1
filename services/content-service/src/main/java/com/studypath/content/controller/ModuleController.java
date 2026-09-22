package com.studypath.content.controller;

import com.studypath.common.dto.ApiResponse;
import com.studypath.content.dto.CreateModuleRequest;
import com.studypath.content.dto.ModuleDto;
import com.studypath.content.dto.TopicDto;
import com.studypath.content.service.ContentService;
import jakarta.validation.Valid;
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

    @PostMapping
    public ApiResponse<ModuleDto> createModule(@Valid @RequestBody CreateModuleRequest request) {
        return ApiResponse.ok("Tạo module thành công", contentService.createModule(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<ModuleDto> updateModule(
            @PathVariable("id") UUID id,
            @Valid @RequestBody CreateModuleRequest request
    ) {
        return ApiResponse.ok("Cập nhật module thành công", contentService.updateModule(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteModule(@PathVariable("id") UUID id) {
        contentService.deleteModule(id);
        return ApiResponse.ok("Xóa module thành công");
    }
}
