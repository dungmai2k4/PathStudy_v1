package com.studypath.content.controller;

import com.studypath.common.dto.ApiResponse;
import com.studypath.content.dto.SkillDto;
import com.studypath.content.dto.SubjectDto;
import com.studypath.content.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/content/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final ContentService contentService;

    @GetMapping
    public ApiResponse<List<SubjectDto>> getAllSubjects() {
        return ApiResponse.ok("Lấy danh sách môn học thành công", contentService.getAllSubjects());
    }

    @GetMapping("/{id}")
    public ApiResponse<SubjectDto> getSubjectById(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy chi tiết môn học thành công", contentService.getSubjectById(id));
    }

    @GetMapping("/code/{code}")
    public ApiResponse<SubjectDto> getSubjectByCode(@PathVariable("code") String code) {
        return ApiResponse.ok("Lấy thông tin môn học thành công", contentService.getSubjectByCode(code));
    }

    @GetMapping("/{id}/skills")
    public ApiResponse<List<SkillDto>> getSkillsBySubjectId(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy danh sách kỹ năng môn học thành công", contentService.getSkillsBySubjectId(id));
    }

    @GetMapping("/{id}/modules")
    public ApiResponse<List<com.studypath.content.dto.ModuleDto>> getModulesBySubjectId(@PathVariable("id") UUID id) {
        return ApiResponse.ok("Lấy danh sách module của môn học thành công", contentService.getModulesBySubjectId(id));
    }
}
