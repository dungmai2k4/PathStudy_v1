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
        return getAllSubjects(null);
    }

    public List<SubjectDto> getAllSubjects(Integer grade) {
        List<SubjectEntity> subjects;
        if (grade != null) {
            subjects = subjectRepository.findByGradeOrGradeIsNullOrderByDisplayOrderAsc(grade);
        } else {
            subjects = subjectRepository.findAllByOrderByDisplayOrderAsc();
        }
        return subjects.stream()
                .map(this::toSubjectDto)
                .collect(Collectors.toList());
    }

    public SubjectDto getSubjectById(UUID id) {
        return subjectRepository.findById(id)
                .map(this::toSubjectDto)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học với ID: " + id));
    }

    public SubjectDto getSubjectByCode(String code) {
        return subjectRepository.findByCodeIgnoreCase(code)
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
        List<LessonEntity> lessons = lessonRepository.findByTopicIdAndIsRemedialOrderByDisplayOrderAsc(topicId, false);
        if (lessons.isEmpty()) {
            lessons = lessonRepository.findBySkillIdOrderByDisplayOrderAsc(topicId).stream()
                    .filter(l -> !Boolean.TRUE.equals(l.getIsRemedial()))
                    .collect(Collectors.toList());
        }
        return lessons.stream()
                .map(lesson -> toLessonDto(lesson, false))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<LessonDto> getRemedialLessonsByTopicId(UUID topicId) {
        List<LessonEntity> remedials = lessonRepository.findByTopicIdAndIsRemedialOrderByDisplayOrderAsc(topicId, true);
        if (remedials.isEmpty()) {
            remedials = lessonRepository.findBySkillIdOrderByDisplayOrderAsc(topicId).stream()
                    .filter(l -> Boolean.TRUE.equals(l.getIsRemedial()))
                    .collect(Collectors.toList());
        }
        if (remedials.isEmpty()) {
            LessonEntity autoRemedial = generateAutoRemedialLesson(topicId);
            if (autoRemedial != null) {
                remedials = List.of(autoRemedial);
            }
        }
        return remedials.stream()
                .map(lesson -> toLessonDto(lesson, false))
                .collect(Collectors.toList());
    }

    @Transactional
    public LessonEntity generateAutoRemedialLesson(UUID topicId) {
        String topicName = "Chủ đề trọng tâm";
        var topOpt = topicRepository.findById(topicId);
        if (topOpt.isPresent()) {
            topicName = topOpt.get().getName();
        } else {
            var skillOpt = skillRepository.findById(topicId);
            if (skillOpt.isPresent()) {
                topicName = skillOpt.get().getName();
            }
        }

        String title = "[Bài học bổ sung] Chuyên đề củng cố & Luyện tập bổ trợ: " + topicName;
        String theorySummary = "Bài học bổ trợ được hệ thống tự động cung cấp nhằm giúp bạn củng cố kiến thức trọng tâm, tránh bẫy câu hỏi thường gặp sau bài kiểm tra.";

        StringBuilder content = new StringBuilder();
        content.append("### Hướng dẫn ôn tập & Củng cố kiến thức: ").append(topicName).append("\n\n");
        content.append("Dựa trên kết quả bài kiểm tra Topic chưa đạt (< 60%), hệ thống đã phân tích và tổng hợp các kiến thức cốt lõi cùng mẹo tránh bẫy bạn cần lưu ý:\n\n");
        content.append("#### 1. Các quy tắc và công thức cốt lõi\n");
        content.append("- Luôn xác định kỹ thì của câu, chủ ngữ chính và tân ngữ trước khi lựa chọn phương án.\n");
        content.append("- Chú ý đến dạng động từ (V-inf, V-ing, V3/ed) và các trợ động từ đi kèm tương ứng.\n");
        content.append("- Nhận diện nhanh các trạng từ chỉ thời gian hoặc từ nhận biết đặc trưng trong câu.\n\n");
        content.append("#### 2. Mẹo phân tích đề thi & Tránh bẫy\n");
        content.append("- Loại trừ ngay các phương án sai thì hoặc sai hòa hợp chủ vị (Subject-Verb Agreement).\n");
        content.append("- Đọc kỹ ngữ cảnh xem câu mang nghĩa chủ động hay bị động, điều kiện có thật hay không có thật.\n");
        content.append("- Cẩn trọng với các cấu trúc đảo ngữ hoặc các trường hợp ngoại lệ bất quy tắc.\n\n");
        content.append("**Nhiệm vụ của bạn:** Hãy đọc kỹ phần củng cố phía trên, sau đó hoàn thành bài Mini-Quiz 3 câu bên dưới để kích hoạt mở khóa thi lại Topic!");

        LessonEntity remedialLesson = LessonEntity.builder()
                .topicId(topicId)
                .skillId(topicId)
                .title(title)
                .theorySummary(theorySummary)
                .content(content.toString())
                .status("PUBLISHED")
                .displayOrder(99)
                .isRemedial(true)
                .build();
        remedialLesson = lessonRepository.save(remedialLesson);

        String quizJson = """
                [
                  {
                    "question": "Khi làm bài tập trắc nghiệm liên quan đến chủ đề này, bước đầu tiên quan trọng nhất là gì?",
                    "options": [
                      "Xác định thì của câu, chủ ngữ chính và dấu hiệu nhận biết",
                      "Chọn ngay phương án dài nhất",
                      "Dịch toàn bộ bài trước khi nhìn 4 phương án",
                      "Bỏ qua các từ nối trong câu"
                    ],
                    "answer": "Xác định thì của câu, chủ ngữ chính và dấu hiệu nhận biết",
                    "explanation": "Xác định chủ ngữ và dấu hiệu thời gian giúp ta loại trừ ngay 2-3 phương án sai ngữ pháp."
                  },
                  {
                    "question": "Phương pháp nào sau đây giúp tránh bẫy hiệu quả nhất khi làm bài thi trắc nghiệm?",
                    "options": [
                      "Phương pháp loại trừ phương án sai ngữ pháp hoặc sai thì",
                      "Đoán mò ngẫu nhiên phương án C",
                      "Chọn phương án có từ vựng khó nhất",
                      "Chỉ đọc 3 từ đầu tiên của câu"
                    ],
                    "answer": "Phương pháp loại trừ phương án sai ngữ pháp hoặc sai thì",
                    "explanation": "Phương pháp loại trừ các câu sai hòa hợp chủ vị hoặc sai thì là chiến thuật làm bài chuẩn xác nhất."
                  },
                  {
                    "question": "Sau khi hoàn thành bài học bổ sung này, bước tiếp theo bạn cần thực hiện là gì?",
                    "options": [
                      "Làm lại bài kiểm tra Topic để đánh giá lại năng lực và mở khóa nội dung tiếp theo",
                      "Bỏ qua và không cần làm bài kiểm tra nữa",
                      "Học lại toàn bộ khóa học từ đầu",
                      "Đăng xuất khỏi hệ thống"
                    ],
                    "answer": "Làm lại bài kiểm tra Topic để đánh giá lại năng lực và mở khóa nội dung tiếp theo",
                    "explanation": "Hoàn thành bài bổ sung giúp bạn tự tin làm lại bài kiểm tra Topic để đạt từ 60% trở lên và mở khóa kiến thức tiếp theo."
                  }
                ]
                """;

        miniQuizRepository.save(MiniQuizEntity.builder()
                .lessonId(remedialLesson.getId())
                .title("Quiz: Củng cố kiến thức " + topicName)
                .description("Trả lời đúng tối thiểu 2 câu để hoàn thành bài cải thiện và mở khóa thi lại Topic.")
                .questionsJson(quizJson)
                .build());

        return remedialLesson;
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

    // --- Module CRUD APIs ---

    @Transactional
    public ModuleDto createModule(CreateModuleRequest request) {
        ModuleEntity entity = ModuleEntity.builder()
                .subjectId(request.getSubjectId())
                .code(request.getCode().toUpperCase().trim())
                .name(request.getName().trim())
                .description(request.getDescription())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .status("ACTIVE")
                .build();
        entity = moduleRepository.save(entity);
        return toModuleDto(entity);
    }

    @Transactional
    public ModuleDto updateModule(UUID id, CreateModuleRequest request) {
        ModuleEntity entity = moduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy module với ID: " + id));
        entity.setName(request.getName().trim());
        entity.setCode(request.getCode().toUpperCase().trim());
        if (request.getDescription() != null) entity.setDescription(request.getDescription());
        if (request.getDisplayOrder() != null) entity.setDisplayOrder(request.getDisplayOrder());
        entity = moduleRepository.save(entity);
        return toModuleDto(entity);
    }

    @Transactional
    public void deleteModule(UUID id) {
        moduleRepository.deleteById(id);
    }

    // --- Topic CRUD APIs ---

    @Transactional
    public TopicDto createTopic(CreateTopicRequest request) {
        TopicEntity entity = TopicEntity.builder()
                .moduleId(request.getModuleId())
                .code(request.getCode().toUpperCase().trim())
                .name(request.getName().trim())
                .description(request.getDescription())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .status("ACTIVE")
                .build();
        entity = topicRepository.save(entity);
        return toTopicDto(entity);
    }

    @Transactional
    public TopicDto updateTopic(UUID id, CreateTopicRequest request) {
        TopicEntity entity = topicRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy topic với ID: " + id));
        entity.setName(request.getName().trim());
        entity.setCode(request.getCode().toUpperCase().trim());
        if (request.getModuleId() != null) entity.setModuleId(request.getModuleId());
        if (request.getDescription() != null) entity.setDescription(request.getDescription());
        if (request.getDisplayOrder() != null) entity.setDisplayOrder(request.getDisplayOrder());
        entity = topicRepository.save(entity);
        return toTopicDto(entity);
    }

    @Transactional
    public void deleteTopic(UUID id) {
        topicRepository.deleteById(id);
    }

    // --- Manager Mutation APIs ---

    @Transactional
    public SubjectDto createSubject(CreateSubjectRequest request) {
        SubjectEntity entity = SubjectEntity.builder()
                .code(request.getCode().toUpperCase().trim())
                .name(request.getName().trim())
                .description(request.getDescription())
                .grade(request.getGrade())
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
        entity.setGrade(request.getGrade());
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
        // Auto-set skillId = topicId for backward compatibility
        UUID effectiveSkillId = request.getSkillId() != null ? request.getSkillId() : request.getTopicId();
        LessonEntity entity = LessonEntity.builder()
                .skillId(effectiveSkillId)
                .topicId(request.getTopicId())
                .title(request.getTitle().trim())
                .content(request.getContent())
                .theorySummary(request.getTheorySummary())
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
        if (request.getTheorySummary() != null) entity.setTheorySummary(request.getTheorySummary());
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

    // --- Example CRUD APIs ---
    @Transactional
    public ExampleDto createExample(UUID lessonId, ExampleDto dto) {
        ExampleEntity entity = ExampleEntity.builder()
                .lessonId(lessonId)
                .title(dto.getTitle() != null ? dto.getTitle().trim() : "Ví dụ minh họa")
                .content(dto.getContent() != null ? dto.getContent().trim() : "")
                .explanation(dto.getExplanation())
                .translation(dto.getTranslation())
                .displayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0)
                .build();
        entity = exampleRepository.save(entity);
        return toExampleDto(entity);
    }

    @Transactional
    public ExampleDto updateExample(UUID exampleId, ExampleDto dto) {
        ExampleEntity entity = exampleRepository.findById(exampleId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ví dụ với ID: " + exampleId));
        if (dto.getTitle() != null) entity.setTitle(dto.getTitle().trim());
        if (dto.getContent() != null) entity.setContent(dto.getContent().trim());
        if (dto.getExplanation() != null) entity.setExplanation(dto.getExplanation());
        if (dto.getTranslation() != null) entity.setTranslation(dto.getTranslation());
        if (dto.getDisplayOrder() != null) entity.setDisplayOrder(dto.getDisplayOrder());
        entity = exampleRepository.save(entity);
        return toExampleDto(entity);
    }

    @Transactional
    public void deleteExample(UUID exampleId) {
        exampleRepository.deleteById(exampleId);
    }

    // --- MiniQuiz CRUD APIs ---
    @Transactional
    public MiniQuizDto createMiniQuiz(UUID lessonId, MiniQuizDto dto) {
        MiniQuizEntity entity = MiniQuizEntity.builder()
                .lessonId(lessonId)
                .title(dto.getTitle() != null ? dto.getTitle().trim() : "Kiểm tra nhanh")
                .description(dto.getDescription())
                .questionsJson(dto.getQuestionsJson() != null ? dto.getQuestionsJson() : "[]")
                .status("ACTIVE")
                .build();
        entity = miniQuizRepository.save(entity);
        return toMiniQuizDto(entity);
    }

    @Transactional
    public MiniQuizDto updateMiniQuiz(UUID quizId, MiniQuizDto dto) {
        MiniQuizEntity entity = miniQuizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy quiz với ID: " + quizId));
        if (dto.getTitle() != null) entity.setTitle(dto.getTitle().trim());
        if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
        if (dto.getQuestionsJson() != null) entity.setQuestionsJson(dto.getQuestionsJson());
        if (dto.getStatus() != null) entity.setStatus(dto.getStatus());
        entity = miniQuizRepository.save(entity);
        return toMiniQuizDto(entity);
    }

    @Transactional
    public void deleteMiniQuiz(UUID quizId) {
        miniQuizRepository.deleteById(quizId);
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
                .grade(entity.getGrade())
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
        long lessonCount = lessonRepository.countBySkillId(entity.getId());
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
