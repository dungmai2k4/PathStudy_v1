package com.studypath.content.service;

import com.studypath.content.domain.*;
import com.studypath.content.dto.*;
import com.studypath.content.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContentService {

    private final SubjectRepository subjectRepository;
    private final ModuleRepository moduleRepository;
    private final TopicRepository topicRepository;
    private final SkillRepository skillRepository;
    private final LessonRepository lessonRepository;
    private final ExampleRepository exampleRepository;
    private final MiniQuizRepository miniQuizRepository;

    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::toSubjectDto)
                .collect(Collectors.toList());
    }

    public SubjectDto getSubjectById(UUID id) {
        return subjectRepository.findById(id)
                .map(this::toSubjectDto)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học với ID: " + id));
    }

    public SubjectDto getSubjectByCode(String code) {
        return subjectRepository.findByCode(code)
                .map(this::toSubjectDto)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học với mã: " + code));
    }

    // --- Module APIs ---
    public List<ModuleDto> getModulesBySubjectId(UUID subjectId) {
        return moduleRepository.findBySubjectIdOrderByDisplayOrderAsc(subjectId).stream()
                .map(this::toModuleDto)
                .collect(Collectors.toList());
    }

    public ModuleDto getModuleById(UUID moduleId) {
        return moduleRepository.findById(moduleId)
                .map(this::toModuleDto)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy module với ID: " + moduleId));
    }

    // --- Topic APIs ---
    public List<TopicDto> getTopicsByModuleId(UUID moduleId) {
        return topicRepository.findByModuleIdOrderByDisplayOrderAsc(moduleId).stream()
                .map(this::toTopicDto)
                .collect(Collectors.toList());
    }

    public TopicDto getTopicById(UUID topicId) {
        return topicRepository.findById(topicId)
                .map(this::toTopicDto)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy topic với ID: " + topicId));
    }

    // --- Lesson APIs by Topic ---
    public List<LessonDto> getLessonsByTopicId(UUID topicId) {
        return lessonRepository.findByTopicIdOrderByDisplayOrderAsc(topicId).stream()
                .map(lesson -> toLessonDto(lesson, false))
                .collect(Collectors.toList());
    }

    public List<LessonDto> getRemedialLessonsByTopicId(UUID topicId) {
        return lessonRepository.findByTopicIdAndIsRemedialOrderByDisplayOrderAsc(topicId, true).stream()
                .map(lesson -> toLessonDto(lesson, false))
                .collect(Collectors.toList());
    }

    // --- Legacy / Skill APIs ---
    public List<SkillDto> getSkillsBySubjectId(UUID subjectId) {
        return skillRepository.findBySubjectIdOrderByDisplayOrderAsc(subjectId).stream()
                .map(this::toSkillDto)
                .collect(Collectors.toList());
    }

    public SkillDto getSkillById(UUID skillId) {
        return skillRepository.findById(skillId)
                .map(this::toSkillDto)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy kỹ năng với ID: " + skillId));
    }

    public List<LessonDto> getLessonsBySkillId(UUID skillId) {
        return lessonRepository.findBySkillIdOrderByDisplayOrderAsc(skillId).stream()
                .map(lesson -> toLessonDto(lesson, false))
                .collect(Collectors.toList());
    }

    public LessonDto getLessonById(UUID lessonId) {
        LessonEntity lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bài học với ID: " + lessonId));
        return toLessonDto(lesson, true);
    }

    public List<ExampleDto> getExamplesByLessonId(UUID lessonId) {
        return exampleRepository.findByLessonIdOrderByDisplayOrderAsc(lessonId).stream()
                .map(this::toExampleDto)
                .collect(Collectors.toList());
    }

    public List<MiniQuizDto> getMiniQuizzesByLessonId(UUID lessonId) {
        return miniQuizRepository.findByLessonId(lessonId).stream()
                .map(this::toMiniQuizDto)
                .collect(Collectors.toList());
    }

    // --- Mappers ---
    private SubjectDto toSubjectDto(SubjectEntity entity) {
        long skillCount = skillRepository.findBySubjectIdOrderByDisplayOrderAsc(entity.getId()).size();
        return SubjectDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .description(entity.getDescription())
                .icon(entity.getIcon())
                .status(entity.getStatus())
                .displayOrder(entity.getDisplayOrder())
                .isAvailable(entity.getIsAvailable())
                .skillCount(skillCount)
                .build();
    }

    private ModuleDto toModuleDto(ModuleEntity entity) {
        List<TopicDto> topics = topicRepository.findByModuleIdOrderByDisplayOrderAsc(entity.getId()).stream()
                .map(this::toTopicDto)
                .collect(Collectors.toList());
        return ModuleDto.builder()
                .id(entity.getId())
                .subjectId(entity.getSubjectId())
                .name(entity.getName())
                .code(entity.getCode())
                .description(entity.getDescription())
                .displayOrder(entity.getDisplayOrder())
                .status(entity.getStatus())
                .topics(topics)
                .build();
    }

    private TopicDto toTopicDto(TopicEntity entity) {
        List<LessonDto> lessons = lessonRepository.findByTopicIdOrderByDisplayOrderAsc(entity.getId()).stream()
                .map(l -> toLessonDto(l, false))
                .collect(Collectors.toList());
        return TopicDto.builder()
                .id(entity.getId())
                .moduleId(entity.getModuleId())
                .name(entity.getName())
                .code(entity.getCode())
                .description(entity.getDescription())
                .displayOrder(entity.getDisplayOrder())
                .status(entity.getStatus())
                .lessons(lessons)
                .build();
    }

    private SkillDto toSkillDto(SkillEntity entity) {
        long lessonCount = lessonRepository.findBySkillIdOrderByDisplayOrderAsc(entity.getId()).size();
        return SkillDto.builder()
                .id(entity.getId())
                .subjectId(entity.getSubjectId())
                .name(entity.getName())
                .code(entity.getCode())
                .description(entity.getDescription())
                .priority(entity.getPriority())
                .status(entity.getStatus())
                .displayOrder(entity.getDisplayOrder())
                .lessonCount(lessonCount)
                .build();
    }

    private LessonDto toLessonDto(LessonEntity entity, boolean includeDetails) {
        List<ExampleDto> examples = null;
        List<MiniQuizDto> miniQuizzes = null;

        if (includeDetails) {
            examples = exampleRepository.findByLessonIdOrderByDisplayOrderAsc(entity.getId()).stream()
                    .map(this::toExampleDto)
                    .collect(Collectors.toList());
            miniQuizzes = miniQuizRepository.findByLessonId(entity.getId()).stream()
                    .map(this::toMiniQuizDto)
                    .collect(Collectors.toList());
        }

        return LessonDto.builder()
                .id(entity.getId())
                .topicId(entity.getTopicId())
                .skillId(entity.getSkillId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .theorySummary(entity.getTheorySummary())
                .isRemedial(entity.getIsRemedial())
                .status(entity.getStatus())
                .displayOrder(entity.getDisplayOrder())
                .examples(examples)
                .miniQuizzes(miniQuizzes)
                .build();
    }

    private ExampleDto toExampleDto(ExampleEntity entity) {
        return ExampleDto.builder()
                .id(entity.getId())
                .lessonId(entity.getLessonId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .explanation(entity.getExplanation())
                .translation(entity.getTranslation())
                .displayOrder(entity.getDisplayOrder())
                .build();
    }

    private MiniQuizDto toMiniQuizDto(MiniQuizEntity entity) {
        return MiniQuizDto.builder()
                .id(entity.getId())
                .lessonId(entity.getLessonId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .questionsJson(entity.getQuestionsJson())
                .status(entity.getStatus())
                .build();
    }
}
