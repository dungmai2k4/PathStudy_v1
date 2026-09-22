package com.studypath.content.controller;

import com.studypath.common.dto.ApiResponse;
import com.studypath.content.dto.CreateSubjectRequest;
import com.studypath.content.dto.SkillDto;
import com.studypath.content.dto.SubjectDto;
import com.studypath.content.service.ContentService;
import jakarta.validation.Valid;
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
    public ApiResponse<List<SubjectDto>> getAllSubjects(@RequestParam(value = "grade", required = false) Integer grade) {
        return ApiResponse.ok("Lấy danh sách môn học thành công", contentService.getAllSubjects(grade));
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

    @PostMapping
    public ApiResponse<SubjectDto> createSubject(@Valid @RequestBody CreateSubjectRequest request) {
        return ApiResponse.ok("Tạo môn học thành công", contentService.createSubject(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<SubjectDto> updateSubject(
            @PathVariable("id") UUID id,
            @Valid @RequestBody CreateSubjectRequest request
    ) {
        return ApiResponse.ok("Cập nhật môn học thành công", contentService.updateSubject(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteSubject(@PathVariable("id") UUID id) {
        contentService.deleteSubject(id);
        return ApiResponse.ok("Xóa môn học thành công");
    }
}
