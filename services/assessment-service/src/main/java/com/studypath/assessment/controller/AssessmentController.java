package com.studypath.assessment.controller;

import com.studypath.assessment.dto.AssessmentDtos.*;
import com.studypath.assessment.service.AssessmentService;
import com.studypath.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping("/placement/generate")
    public ApiResponse<AssessmentTestDto> generatePlacementTest(
            @RequestBody GeneratePlacementTestRequest request
    ) {
        AssessmentTestDto dto = assessmentService.generatePlacementTest(request.getSubjectId(), request.getStudentId());
        return ApiResponse.ok("Khởi tạo bài khảo sát năng lực ngẫu nhiên thành công", dto);
    }

    @PostMapping("/skill-test/generate")
    public ApiResponse<AssessmentTestDto> generateSkillTest(
            @RequestBody GenerateSkillTestRequest request
    ) {
        AssessmentTestDto dto = assessmentService.generateSkillTest(request);
        return ApiResponse.ok("Khởi tạo bài kiểm tra kỹ năng thành công", dto);
    }

    @PostMapping("/{attemptId}/submit")
    public ApiResponse<AssessmentResultDto> submitAssessment(
            @PathVariable("attemptId") UUID attemptId,
            @RequestBody SubmitAssessmentRequest request
    ) {
        AssessmentResultDto result = assessmentService.submitAssessment(attemptId, request);
        return ApiResponse.ok("Nộp bài và chấm điểm năng lực thành công", result);
    }

    @GetMapping("/attempts/{attemptId}/result")
    public ApiResponse<AssessmentResultDto> getAttemptResult(
            @PathVariable("attemptId") UUID attemptId
    ) {
        return ApiResponse.ok("Lấy kết quả làm bài thành công", assessmentService.getAttemptResult(attemptId));
    }

    @GetMapping("/history")
    public ApiResponse<List<AssessmentAttemptSummaryDto>> getHistory(
            @RequestParam("studentId") UUID studentId,
            @RequestParam(value = "type", required = false) String type
    ) {
        return ApiResponse.ok("Lấy lịch sử đánh giá thành công", assessmentService.getAssessmentHistory(studentId, type));
    }

    @PostMapping("/topic-test/generate")
    public ApiResponse<AssessmentTestDto> generateTopicTest(
            @RequestBody GenerateTopicTestRequest request
    ) {
        AssessmentTestDto dto = assessmentService.generateTopicTest(request);
        return ApiResponse.ok("Khởi tạo bài kiểm tra Topic thành công", dto);
    }

    @PostMapping("/course-test/generate")
    public ApiResponse<AssessmentTestDto> generateCourseFinalTest(
            @RequestBody GenerateCourseTestRequest request
    ) {
        AssessmentTestDto dto = assessmentService.generateCourseFinalTest(request);
        return ApiResponse.ok("Khởi tạo bài kiểm tra tổng kết môn học thành công", dto);
    }

    @GetMapping("/history/topic")
    public ApiResponse<List<AssessmentAttemptSummaryDto>> getTopicTestHistory(
            @RequestParam("studentId") UUID studentId,
            @RequestParam("topicId") UUID topicId
    ) {
        return ApiResponse.ok("Lấy lịch sử kiểm tra theo chủ đề (topic) thành công", assessmentService.getTopicTestHistory(studentId, topicId));
    }

    @GetMapping("/history/subject")
    public ApiResponse<List<AssessmentAttemptSummaryDto>> getSubjectTestHistory(
            @RequestParam("studentId") UUID studentId,
            @RequestParam("subjectId") UUID subjectId
    ) {
        return ApiResponse.ok("Lấy lịch sử kiểm tra tổng thể môn học thành công", assessmentService.getSubjectTestHistory(studentId, subjectId));
    }

    @GetMapping("/skill-test/history")
    public ApiResponse<List<AssessmentAttemptSummaryDto>> getSkillTestHistory(
            @RequestParam("studentId") UUID studentId,
            @RequestParam("skillId") UUID skillId
    ) {
        return ApiResponse.ok("Lấy lịch sử kiểm tra kỹ năng thành công", assessmentService.getSkillTestHistory(studentId, skillId));
    }
}
