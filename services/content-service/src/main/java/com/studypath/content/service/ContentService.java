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
