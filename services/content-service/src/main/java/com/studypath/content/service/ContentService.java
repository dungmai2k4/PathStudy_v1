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
        List<LessonEntity> lessons = lessonRepository.findByTopicIdOrderByDisplayOrderAsc(topicId);
        if (lessons.isEmpty()) {
            lessons = lessonRepository.findBySkillIdOrderByDisplayOrderAsc(topicId);
        }
        return lessons.stream()
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

    // --- Manager Mutation APIs ---

    @Transactional
    public SubjectDto createSubject(CreateSubjectRequest request) {
        SubjectEntity entity = SubjectEntity.builder()
                .code(request.getCode().toUpperCase().trim())
                .name(request.getName().trim())
                .description(request.getDescription())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .isAvailable(true)
                .status("ACTIVE")
                .build();
        entity = subjectRepository.save(entity);
        return toSubjectDto(entity);
    }

    @Transactional
    public SubjectDto updateSubject(UUID id, CreateSubjectRequest request) {
        SubjectEntity entity = subjectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học với ID: " + id));
        entity.setName(request.getName());
        entity.setCode(request.getCode().toUpperCase().trim());
        if (request.getDescription() != null) entity.setDescription(request.getDescription());
        if (request.getDisplayOrder() != null) entity.setDisplayOrder(request.getDisplayOrder());
        entity = subjectRepository.save(entity);
        return toSubjectDto(entity);
    }

    @Transactional
    public void deleteSubject(UUID id) {
        subjectRepository.deleteById(id);
    }

    @Transactional
    public SkillDto createSkill(CreateSkillRequest request) {
        SkillEntity entity = SkillEntity.builder()
                .subjectId(request.getSubjectId())
                .code(request.getCode().trim())
                .name(request.getName().trim())
                .description(request.getDescription())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .priority(2)
                .status("ACTIVE")
                .build();
        entity = skillRepository.save(entity);
        return toSkillDto(entity);
    }

    @Transactional
    public SkillDto updateSkill(UUID id, CreateSkillRequest request) {
        SkillEntity entity = skillRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy kỹ năng với ID: " + id));
        entity.setName(request.getName());
        entity.setCode(request.getCode().trim());
        if (request.getDescription() != null) entity.setDescription(request.getDescription());
        if (request.getDisplayOrder() != null) entity.setDisplayOrder(request.getDisplayOrder());
        entity = skillRepository.save(entity);
        return toSkillDto(entity);
    }

    @Transactional
    public void deleteSkill(UUID id) {
        skillRepository.deleteById(id);
    }

    @Transactional
    public LessonDto createLesson(CreateLessonRequest request) {
        LessonEntity entity = LessonEntity.builder()
                .skillId(request.getSkillId())
                .topicId(request.getTopicId())
                .title(request.getTitle().trim())
                .content(request.getContent())
                .isRemedial(Boolean.TRUE.equals(request.getIsRemedial()))
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .status("ACTIVE")
                .build();
        entity = lessonRepository.save(entity);
        return toLessonDto(entity, false);
    }

    @Transactional
    public LessonDto updateLesson(UUID id, CreateLessonRequest request) {
        LessonEntity entity = lessonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bài học với ID: " + id));
        entity.setTitle(request.getTitle());
        entity.setContent(request.getContent());
        if (request.getSkillId() != null) entity.setSkillId(request.getSkillId());
        if (request.getTopicId() != null) entity.setTopicId(request.getTopicId());
        if (request.getDisplayOrder() != null) entity.setDisplayOrder(request.getDisplayOrder());
        if (request.getIsRemedial() != null) entity.setIsRemedial(request.getIsRemedial());
        entity = lessonRepository.save(entity);
        return toLessonDto(entity, false);
    }

    @Transactional
    public void deleteLesson(UUID id) {
        lessonRepository.deleteById(id);
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
