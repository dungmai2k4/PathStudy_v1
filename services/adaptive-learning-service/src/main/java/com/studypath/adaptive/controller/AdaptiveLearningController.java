package com.studypath.adaptive.controller;

import com.studypath.adaptive.dto.AdaptiveDtos.*;
import com.studypath.adaptive.service.AdaptiveLearningService;
import com.studypath.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/adaptive/study-path")
@RequiredArgsConstructor
public class AdaptiveLearningController {

    private final AdaptiveLearningService adaptiveLearningService;

    @PostMapping("/generate")
    public ApiResponse<StudyPathDto> generateStudyPath(
            @RequestBody GenerateStudyPathRequest request
    ) {
        StudyPathDto dto = adaptiveLearningService.generateStudyPathFromAssessment(request);
        return ApiResponse.ok("Tạo lộ trình học thích ứng cá nhân hóa thành công", dto);
    }

    @GetMapping("/my-subjects")
    public ApiResponse<List<EnrolledSubjectDto>> getMySubjects(
            @RequestParam("studentId") UUID studentId
    ) {
        return ApiResponse.ok("Lấy danh sách môn học đang có lộ trình thành công",
                adaptiveLearningService.getMySubjects(studentId));
    }

    @GetMapping("/my-path")
    public ApiResponse<StudyPathDto> getMyStudyPath(
            @RequestParam("studentId") UUID studentId,
            @RequestParam("subjectId") UUID subjectId
    ) {
        return ApiResponse.ok("Lấy chi tiết lộ trình học thích ứng thành công",
                adaptiveLearningService.getMyStudyPath(studentId, subjectId));
    }

    @PostMapping("/unlock-next-skill")
    public ApiResponse<UnlockResponse> unlockNextSkill(
            @RequestBody UnlockNextSkillRequest request
    ) {
        UnlockResponse resp = adaptiveLearningService.unlockNextSkill(request);
        return ApiResponse.ok("Cập nhật tiến độ kỹ năng thành công", resp);
    }

    @PostMapping("/lesson-progress")
    public ApiResponse<LessonProgressDto> recordLessonProgress(
            @RequestBody RecordLessonProgressRequest request
    ) {
        return ApiResponse.ok("Cập nhật tiến độ bài học thành công", adaptiveLearningService.recordLessonProgress(request));
    }

    @GetMapping("/lesson-progress")
    public ApiResponse<List<LessonProgressDto>> getLessonProgress(
            @RequestParam("studentId") UUID studentId,
            @RequestParam("topicId") UUID topicId
    ) {
        return ApiResponse.ok("Lấy danh sách tiến độ bài học trong chủ đề thành công", adaptiveLearningService.getLessonProgress(studentId, topicId));
    }

    @PostMapping("/topic-test/failed")
    public ApiResponse<StudyPathDto> handleTopicTestFailed(
            @RequestBody TopicRemedialRequest request
    ) {
        return ApiResponse.ok("Kích hoạt chế độ bổ trợ kiến thức thành công", adaptiveLearningService.handleTopicTestFailed(request));
    }

    @PostMapping("/course-test/completed")
    public ApiResponse<StudyPathDto> completeCourseFinalTest(
            @RequestBody CompleteCourseTestRequest request
    ) {
        return ApiResponse.ok("Hoàn thành bài kiểm tra tổng kết môn học thành công", adaptiveLearningService.completeCourseFinalTest(request));
    }
}
