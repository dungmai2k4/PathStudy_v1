package com.studypath.adaptive.service;

import com.studypath.adaptive.domain.SkillProfileEntity;
import com.studypath.adaptive.domain.StudyPathEntity;
import com.studypath.adaptive.domain.StudyPathSkillNodeEntity;
import com.studypath.adaptive.dto.AdaptiveDtos.*;
import com.studypath.adaptive.repository.SkillProfileRepository;
import com.studypath.adaptive.repository.StudyPathRepository;
import com.studypath.adaptive.repository.StudyPathSkillNodeRepository;
import com.studypath.adaptive.domain.StudentLessonProgressEntity;
import com.studypath.adaptive.repository.StudentLessonProgressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdaptiveLearningService {

    private final StudyPathRepository studyPathRepository;
    private final StudyPathSkillNodeRepository studyPathSkillNodeRepository;
    private final SkillProfileRepository skillProfileRepository;
    private final StudentLessonProgressRepository studentLessonProgressRepository;
    private final RestTemplate restTemplate;

    @Value("${app.services.assessment-url:http://localhost:8084}")
    private String assessmentServiceUrl;

    @Value("${app.services.content-url:http://localhost:8082}")
    private String contentServiceUrl;

    // Fixed UUIDs for English Skills — canonical order (used as fallback for unknown skills)
    private static final Map<UUID, String> ENGLISH_SKILLS = new LinkedHashMap<>();
    static {
        ENGLISH_SKILLS.put(UUID.fromString("22222222-2222-2222-2222-222222222201"), "Các thì cơ bản và nâng cao (Verb Tenses)");
        ENGLISH_SKILLS.put(UUID.fromString("22222222-2222-2222-2222-222222222202"), "Câu bị động (Passive Voice)");
        ENGLISH_SKILLS.put(UUID.fromString("22222222-2222-2222-2222-222222222203"), "Câu điều kiện (Conditionals)");
        ENGLISH_SKILLS.put(UUID.fromString("22222222-2222-2222-2222-222222222204"), "Mệnh đề quan hệ (Relative Clauses)");
        ENGLISH_SKILLS.put(UUID.fromString("22222222-2222-2222-2222-222222222205"), "Từ vựng & Cụm từ cố định (Collocations)");
        ENGLISH_SKILLS.put(UUID.fromString("22222222-2222-2222-2222-222222222206"), "Đọc hiểu văn bản (Reading Comprehension)");
    }

    @Transactional
    public StudyPathDto generateStudyPathFromAssessment(GenerateStudyPathRequest request) {
        log.info("=== GENERATING ADAPTIVE STUDY PATH ===");
        log.info("Student: {}, Subject: {}, AttemptId: {}", request.getStudentId(), request.getSubjectId(), request.getAssessmentAttemptId());

        // ===== STEP 1: Resolve skill accuracies (priority: direct payload > fetch from assessment-service) =====
        Map<UUID, Integer> skillAccuracies = new HashMap<>();
        Map<UUID, String> skillProficiencies = new HashMap<>();

        if (request.getSkillBreakdown() != null && !request.getSkillBreakdown().isEmpty()) {
            // PREFERRED PATH: Client passed the breakdown directly — guaranteed to be accurate!
            log.info("Using skill breakdown provided directly from client ({} skills).", request.getSkillBreakdown().size());
            for (SkillResultPayload s : request.getSkillBreakdown()) {
                skillAccuracies.put(s.getSkillId(), s.getAccuracyPercentage() != null ? s.getAccuracyPercentage() : 50);
                skillProficiencies.put(s.getSkillId(), s.getProficiencyLevel() != null ? s.getProficiencyLevel() : "NEEDS_IMPROVEMENT");
            }
        } else if (request.getAssessmentAttemptId() != null) {
            // FALLBACK PATH: Fetch from assessment-service
            log.warn("No skillBreakdown in request — attempting to fetch from assessment-service...");
            try {
                String url = assessmentServiceUrl + "/api/v1/assessments/attempts/" + request.getAssessmentAttemptId() + "/result";
                ResponseEntity<Map<String, Object>> resp = restTemplate.exchange(
                        url, HttpMethod.GET, null,
                        new ParameterizedTypeReference<Map<String, Object>>() {}
                );
                if (resp.getBody() != null && resp.getBody().get("data") != null) {
                    Map<String, Object> data = (Map<String, Object>) resp.getBody().get("data");
                    List<Map<String, Object>> breakdown = (List<Map<String, Object>>) data.get("skillBreakdown");
                    if (breakdown != null) {
                        for (Map<String, Object> item : breakdown) {
                            UUID sId = UUID.fromString((String) item.get("skillId"));
                            Number acc = (Number) item.get("accuracyPercentage");
                            String prof = (String) item.getOrDefault("proficiencyLevel", "NEEDS_IMPROVEMENT");
                            skillAccuracies.put(sId, acc != null ? acc.intValue() : 50);
                            skillProficiencies.put(sId, prof);
                        }
                        log.info("Fetched {} skill results from assessment-service.", skillAccuracies.size());
                    }
                }
            } catch (Exception e) {
                log.warn("Could not fetch from assessment-service: {}. Using default 50% for all skills.", e.getMessage());
            }
        }

        // Fetch dynamic modules with topics from content-service
        List<Map<String, Object>> dynamicModules = fetchModulesWithTopics(request.getSubjectId());
        
        // Flatten topics with module context
        // Each entry: topicId -> { topicName, moduleId, moduleName, displayOrder }
        class TopicContext {
            UUID topicId;
            String topicName;
            UUID moduleId;
            String moduleName;
            int displayOrder;
            TopicContext(UUID topicId, String topicName, UUID moduleId, String moduleName, int displayOrder) {
                this.topicId = topicId;
                this.topicName = topicName;
                this.moduleId = moduleId;
                this.moduleName = moduleName;
                this.displayOrder = displayOrder;
            }
        }
        
        List<TopicContext> allTopics = new ArrayList<>();
        if (!dynamicModules.isEmpty()) {
            for (Map<String, Object> mod : dynamicModules) {
                UUID mId = UUID.fromString((String) mod.get("id"));
                String mName = (String) mod.get("name");
                List<Map<String, Object>> topics = (List<Map<String, Object>>) mod.get("topics");
                if (topics != null) {
                    for (Map<String, Object> top : topics) {
                        UUID tId = UUID.fromString((String) top.get("id"));
                        String tName = (String) top.get("name");
                        int dOrder = top.get("displayOrder") != null ? ((Number) top.get("displayOrder")).intValue() : 0;
                        allTopics.add(new TopicContext(tId, tName, mId, mName, dOrder));
                    }
                }
            }
        }

        // Fallback: If no dynamic topics found, fallback to ENGLISH_SKILLS
        if (allTopics.isEmpty()) {
            UUID grammarModId = UUID.fromString("22222222-2222-2222-2222-222222222210");
            UUID vocabModId = UUID.fromString("22222222-2222-2222-2222-222222222220");
            for (Map.Entry<UUID, String> entry : ENGLISH_SKILLS.entrySet()) {
                UUID sId = entry.getKey();
                boolean isGrammar = sId.toString().endsWith("01") || sId.toString().endsWith("02") || sId.toString().endsWith("03") || sId.toString().endsWith("04");
                allTopics.add(new TopicContext(
                        sId,
                        entry.getValue(),
                        isGrammar ? grammarModId : vocabModId,
                        isGrammar ? "Ngữ pháp (Grammar)" : "Từ vựng (Vocabulary)",
                        0
                ));
            }
        }

        // Log the accuracy map for debugging
        log.info("=== SKILL/TOPIC ACCURACY MAP ({} topics) ===", allTopics.size());
        for (TopicContext tc : allTopics) {
            int acc = skillAccuracies.getOrDefault(tc.topicId, -1);
            log.info("  Topic [{}] '{}' (Module: '{}'): accuracy={}%", tc.topicId, tc.topicName, tc.moduleName, acc == -1 ? "NOT_ASSESSED(default 50)" : acc);
        }

        // ===== STEP 2: Rule-Based Adaptive Algorithm per topic =====
        // Group by accuracy: NEEDS_IMPROVEMENT (<60%), PROFICIENT (60-84%), MASTERY (>=85%)
        List<TopicContext> needsImprovement = new ArrayList<>();
        List<TopicContext> proficient = new ArrayList<>();
        List<TopicContext> mastery = new ArrayList<>();

        for (TopicContext tc : allTopics) {
            int acc = skillAccuracies.getOrDefault(tc.topicId, 50);
            if (acc < 60) {
                needsImprovement.add(tc);
            } else if (acc < 85) {
                proficient.add(tc);
            } else {
                mastery.add(tc);
            }
        }

        // Sort within each group: lowest accuracy first
        Comparator<TopicContext> byAccuracyAsc =
                Comparator.comparingInt(tc -> skillAccuracies.getOrDefault(tc.topicId, 50));
        needsImprovement.sort(byAccuracyAsc);
        proficient.sort(byAccuracyAsc);
        mastery.sort(byAccuracyAsc);

        // Final ordered list: weak -> moderate -> strong
        List<TopicContext> sortedTopics = new ArrayList<>();
        sortedTopics.addAll(needsImprovement);
        sortedTopics.addAll(proficient);
        sortedTopics.addAll(mastery);

        log.info("=== ADAPTIVE ROADMAP ORDER ===");
        for (int i = 0; i < sortedTopics.size(); i++) {
            TopicContext tc = sortedTopics.get(i);
            int acc = skillAccuracies.getOrDefault(tc.topicId, 50);
            log.info("  #{}: [{}] '{}' — {}% ({})", i + 1, tc.moduleName, tc.topicName, acc,
                    acc < 60 ? "NEEDS_IMPROVEMENT -> ưu tiên đầu" : acc < 85 ? "PROFICIENT" : "MASTERY");
        }

        // ===== STEP 3: Save/update SkillProfile records =====
        for (TopicContext tc : allTopics) {
            UUID sId = tc.topicId;
            int acc = skillAccuracies.getOrDefault(sId, 50);
            String level = skillProficiencies.getOrDefault(sId,
                    acc >= 85 ? "MASTERY" : acc >= 60 ? "PROFICIENT" : "NEEDS_IMPROVEMENT");

            SkillProfileEntity profile = skillProfileRepository.findByStudentIdAndSkillId(request.getStudentId(), sId)
                    .orElseGet(() -> SkillProfileEntity.builder()
                            .studentId(request.getStudentId())
                            .subjectId(request.getSubjectId())
                            .skillId(sId)
                            .build());
            profile.setSkillName(tc.topicName);
            profile.setAccuracyPercentage(acc);
            profile.setMasteryLevel(level);
            skillProfileRepository.save(profile);
        }

        // ===== STEP 4: Create/update StudyPath =====
        StudyPathEntity studyPath = studyPathRepository.findByStudentIdAndSubjectId(request.getStudentId(), request.getSubjectId())
                .orElseGet(() -> StudyPathEntity.builder()
                        .studentId(request.getStudentId())
                        .subjectId(request.getSubjectId())
                        .subjectName("Tiếng Anh THPT")
                        .build());

        studyPath.setAssessmentAttemptId(request.getAssessmentAttemptId());
        studyPath.setTotalSkills(sortedTopics.size());
        studyPath.setCompletedSkills(0);
        studyPath.setProgressPercentage(0);
        studyPath.setStatus("ACTIVE");
        studyPath = studyPathRepository.save(studyPath);

        // Clear old nodes to regenerate from scratch
        studyPathSkillNodeRepository.deleteByStudyPathId(studyPath.getId());

        // ===== STEP 5: Create skill nodes with proficiency context =====
        List<SkillNodeDto> nodeDtos = new ArrayList<>();
        Set<UUID> unlockedModules = new HashSet<>();
        int seq = 1;

        for (TopicContext tc : sortedTopics) {
            UUID sId = tc.topicId;
            String sName = tc.topicName;
            int baseline = skillAccuracies.getOrDefault(sId, 50);
            String profLevel = skillProficiencies.getOrDefault(sId,
                    baseline >= 85 ? "MASTERY" : baseline >= 60 ? "PROFICIENT" : "NEEDS_IMPROVEMENT");

            String reason = buildPriorityReason(baseline, profLevel, seq, sortedTopics.size());

            UUID modId = tc.moduleId;
            String modName = tc.moduleName;

            // Each module is independent: unlock the first topic of each module
            boolean isFirstInModule = unlockedModules.add(modId);
            String nodeStatus = isFirstInModule ? "UNLOCKED" : "LOCKED";
            Instant unlockedAt = isFirstInModule ? Instant.now() : null;

            StudyPathSkillNodeEntity node = StudyPathSkillNodeEntity.builder()
                    .studyPathId(studyPath.getId())
                    .skillId(sId)
                    .skillName(sName)
                    .moduleId(modId)
                    .moduleName(modName)
                    .topicId(sId)
                    .sequenceOrder(seq)
                    .status(nodeStatus)
                    .baselineAccuracy(baseline)
                    .proficiencyLevel(profLevel)
                    .priorityReason(reason)
                    .hasRemedialActive(false)
                    .milestoneTestPassed(false)
                    .unlockedAt(unlockedAt)
                    .build();

            node = studyPathSkillNodeRepository.save(node);

            nodeDtos.add(SkillNodeDto.builder()
                    .id(node.getId())
                    .skillId(sId)
                    .skillName(sName)
                    .moduleId(modId)
                    .moduleName(modName)
                    .topicId(sId)
                    .sequenceOrder(seq)
                    .status(nodeStatus)
                    .baselineAccuracy(baseline)
                    .proficiencyLevel(profLevel)
                    .priorityReason(reason)
                    .hasRemedialActive(false)
                    .remedialReason(null)
                    .milestoneTestPassed(false)
                    .lessonCount(estimateLessonCount(profLevel))
                    .build());

            seq++;
        }

        log.info("=== STUDY PATH GENERATED SUCCESSFULLY: {} nodes across {} modules ===", nodeDtos.size(), unlockedModules.size());

        return StudyPathDto.builder()
                .id(studyPath.getId())
                .studentId(studyPath.getStudentId())
                .subjectId(studyPath.getSubjectId())
                .subjectName(studyPath.getSubjectName())
                .assessmentAttemptId(studyPath.getAssessmentAttemptId())
                .totalSkills(studyPath.getTotalSkills())
                .completedSkills(studyPath.getCompletedSkills())
                .progressPercentage(studyPath.getProgressPercentage())
                .status(studyPath.getStatus())
                .nodes(nodeDtos)
                .build();
    }

    /**
     * Builds a human-readable adaptive priority reason for display in the roadmap UI.
     */
    private String buildPriorityReason(int accuracy, String profLevel, int seq, int total) {
        if ("NEEDS_IMPROVEMENT".equals(profLevel)) {
            return String.format("Kỹ năng yếu (%d%%) – Ưu tiên củng cố nền tảng trước", accuracy);
        } else if ("PROFICIENT".equals(profLevel)) {
            return String.format("Kỹ năng khá (%d%%) – Luyện tập nâng cao", accuracy);
        } else {
            return String.format("Kỹ năng tốt (%d%%) – Ôn tập & mở rộng", accuracy);
        }
    }

    /**
     * Estimates lesson count based on proficiency level.
     * Weaker skills get more lesson modules to build up.
     */
    private int estimateLessonCount(String profLevel) {
        return switch (profLevel) {
            case "NEEDS_IMPROVEMENT" -> 4; // 4 lessons + mini quiz + milestone test
            case "PROFICIENT"        -> 3; // 3 lessons + mini quiz + milestone test
            default                  -> 2; // 2 review lessons + milestone test
        };
    }

    @Transactional(readOnly = true)
    public List<EnrolledSubjectDto> getMySubjects(UUID studentId) {
        List<StudyPathEntity> paths = studyPathRepository.findByStudentId(studentId);
        List<EnrolledSubjectDto> result = new ArrayList<>();

        for (StudyPathEntity path : paths) {
            List<StudyPathSkillNodeEntity> nodes = studyPathSkillNodeRepository.findByStudyPathIdOrderBySequenceOrderAsc(path.getId());

            StudyPathSkillNodeEntity current = nodes.stream()
                    .filter(n -> "UNLOCKED".equals(n.getStatus()) || "NEEDS_REMEDIATION".equals(n.getStatus()))
                    .findFirst()
                    .orElse(nodes.isEmpty() ? null : nodes.get(0));

            result.add(EnrolledSubjectDto.builder()
                    .subjectId(path.getSubjectId())
                    .subjectName(path.getSubjectName())
                    .subjectCode("english")
                    .icon("BookOpen")
                    .progressPercentage(path.getProgressPercentage())
                    .totalSkills(path.getTotalSkills())
                    .completedSkills(path.getCompletedSkills())
                    .currentSkillName(current != null ? current.getSkillName() : "Khởi tạo lộ trình")
                    .currentSkillId(current != null ? (current.getTopicId() != null ? current.getTopicId() : current.getSkillId()) : null)
                    .build());
        }
        return result;
    }

    @Transactional(readOnly = true)
    public StudyPathDto getMyStudyPath(UUID studentId, UUID subjectId) {
        StudyPathEntity path = studyPathRepository.findByStudentIdAndSubjectId(studentId, subjectId)
                .orElse(null);
        if (path == null) return null;

        List<StudyPathSkillNodeEntity> nodes = studyPathSkillNodeRepository.findByStudyPathIdOrderBySequenceOrderAsc(path.getId());
        List<SkillNodeDto> nodeDtos = nodes.stream().map(n -> SkillNodeDto.builder()
                .id(n.getId())
                .skillId(n.getSkillId())
                .skillName(n.getSkillName())
                .moduleId(n.getModuleId())
                .moduleName(n.getModuleName())
                .topicId(n.getTopicId() != null ? n.getTopicId() : n.getSkillId())
                .sequenceOrder(n.getSequenceOrder())
                .status(n.getStatus())
                .baselineAccuracy(n.getBaselineAccuracy())
                .proficiencyLevel(n.getProficiencyLevel())
                .priorityReason(n.getPriorityReason())
                .hasRemedialActive(n.getHasRemedialActive() != null && n.getHasRemedialActive())
                .remedialReason(n.getRemedialReason())
                .milestoneTestPassed(n.getMilestoneTestPassed())
                .lessonCount(estimateLessonCount(n.getProficiencyLevel() != null ? n.getProficiencyLevel() : "NEEDS_IMPROVEMENT"))
                .lessonOrderJson(n.getLessonOrderJson())
                .build()).collect(Collectors.toList());

        return StudyPathDto.builder()
                .id(path.getId())
                .studentId(path.getStudentId())
                .subjectId(path.getSubjectId())
                .subjectName(path.getSubjectName())
                .assessmentAttemptId(path.getAssessmentAttemptId())
                .totalSkills(path.getTotalSkills())
                .completedSkills(path.getCompletedSkills())
                .progressPercentage(path.getProgressPercentage())
                .status(path.getStatus())
                .nodes(nodeDtos)
                .build();
    }

    @Transactional
    public UnlockResponse unlockNextSkill(UnlockNextSkillRequest request) {
        StudyPathEntity path = studyPathRepository.findByStudentIdAndSubjectId(request.getStudentId(), request.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lộ trình học của học sinh"));

        UUID targetId = request.getTopicId() != null ? request.getTopicId() : request.getSkillId();

        StudyPathSkillNodeEntity currentNode = studyPathSkillNodeRepository.findByStudyPathIdAndSkillId(path.getId(), targetId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy chủ đề/kỹ năng trong lộ trình"));

        // Mark current node as COMPLETED & clear remedial state
        currentNode.setStatus("COMPLETED");
        currentNode.setMilestoneTestPassed(true);
        currentNode.setHasRemedialActive(false);
        currentNode.setRemedialReason(null);
        currentNode.setCompletedAt(Instant.now());
        studyPathSkillNodeRepository.save(currentNode);

        // Find and unlock next node in the SAME module
        List<StudyPathSkillNodeEntity> allNodes = studyPathSkillNodeRepository.findByStudyPathIdOrderBySequenceOrderAsc(path.getId());
        List<StudyPathSkillNodeEntity> sameModuleNodes = allNodes.stream()
                .filter(n -> Objects.equals(n.getModuleId(), currentNode.getModuleId()) ||
                             (n.getModuleName() != null && n.getModuleName().equalsIgnoreCase(currentNode.getModuleName())))
                .toList();

        int curIdx = -1;
        for (int i = 0; i < sameModuleNodes.size(); i++) {
            if (sameModuleNodes.get(i).getId().equals(currentNode.getId())) {
                curIdx = i;
                break;
            }
        }

        String msg;
        if (curIdx >= 0 && curIdx + 1 < sameModuleNodes.size()) {
            StudyPathSkillNodeEntity nextNode = sameModuleNodes.get(curIdx + 1);
            if (!"COMPLETED".equals(nextNode.getStatus())) {
                nextNode.setStatus("UNLOCKED");
                nextNode.setUnlockedAt(Instant.now());
                studyPathSkillNodeRepository.save(nextNode);
            }
            msg = "Chúc mừng! Bạn đã vượt qua bài kiểm tra Topic và mở khóa: " + nextNode.getSkillName();
        } else {
            msg = "Xuất sắc! Bạn đã hoàn thành toàn bộ chủ đề trong module này.";
        }

        // Recalculate progress across all modules
        long completed = allNodes.stream().filter(n -> "COMPLETED".equals(n.getStatus())).count();
        path.setCompletedSkills((int) completed);
        int total = allNodes.isEmpty() ? 1 : allNodes.size();
        path.setProgressPercentage(Math.round((float) completed * 100 / total));
        if (completed == total) {
            path.setStatus("COMPLETED");
            msg = "Xuất sắc! Bạn đã hoàn thành toàn bộ chủ đề trong môn học. Hãy tiến hành làm bài kiểm tra tổng kết môn!";
        }
        studyPathRepository.save(path);

        return UnlockResponse.builder()
                .unlocked(true)
                .message(msg)
                .studyPath(getMyStudyPath(request.getStudentId(), request.getSubjectId()))
                .build();
    }

    @Transactional
    public LessonProgressDto recordLessonProgress(RecordLessonProgressRequest request) {
        log.info("Recording lesson progress for student={}, topic={}, lesson={}, completed={}, quizCompleted={}, quizScore={}",
                request.getStudentId(), request.getTopicId(), request.getLessonId(),
                request.getIsCompleted(), request.getQuizCompleted(), request.getQuizScore());

        StudentLessonProgressEntity progress = studentLessonProgressRepository
                .findByStudentIdAndLessonId(request.getStudentId(), request.getLessonId())
                .orElseGet(() -> StudentLessonProgressEntity.builder()
                        .studentId(request.getStudentId())
                        .topicId(request.getTopicId())
                        .lessonId(request.getLessonId())
                        .build());

        if (request.getIsCompleted() != null) {
            progress.setIsCompleted(request.getIsCompleted());
        }
        if (request.getQuizCompleted() != null) {
            progress.setQuizCompleted(request.getQuizCompleted());
        }
        if (request.getQuizScore() != null) {
            progress.setQuizScore(request.getQuizScore());
        }
        progress.setCompletedAt(Instant.now());
        progress = studentLessonProgressRepository.save(progress);

        return LessonProgressDto.builder()
                .lessonId(progress.getLessonId())
                .topicId(progress.getTopicId())
                .isCompleted(progress.getIsCompleted())
                .quizCompleted(progress.getQuizCompleted())
                .quizScore(progress.getQuizScore())
                .completedAt(progress.getCompletedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<LessonProgressDto> getLessonProgress(UUID studentId, UUID topicId) {
        List<StudentLessonProgressEntity> list = studentLessonProgressRepository.findByStudentIdAndTopicId(studentId, topicId);
        return list.stream().map(p -> LessonProgressDto.builder()
                .lessonId(p.getLessonId())
                .topicId(p.getTopicId())
                .isCompleted(p.getIsCompleted())
                .quizCompleted(p.getQuizCompleted())
                .quizScore(p.getQuizScore())
                .completedAt(p.getCompletedAt())
                .build()).collect(Collectors.toList());
    }

    @Transactional
    public StudyPathDto handleTopicTestFailed(TopicRemedialRequest request) {
        log.info("Handling topic test failed for student={}, topic={}, score={}%",
                request.getStudentId(), request.getTopicId(), request.getScorePercentage());

        StudyPathEntity path = studyPathRepository.findByStudentIdAndSubjectId(request.getStudentId(), request.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lộ trình học của học sinh"));

        StudyPathSkillNodeEntity node = studyPathSkillNodeRepository.findByStudyPathIdAndSkillId(path.getId(), request.getTopicId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy chủ đề trong lộ trình"));

        node.setStatus("NEEDS_REMEDIATION");
        node.setHasRemedialActive(true);

        if (request.getWeakLessonIds() != null && !request.getWeakLessonIds().isEmpty()) {
            try {
                String json = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(request.getWeakLessonIds());
                node.setLessonOrderJson(json);
            } catch (Exception e) {
                log.error("Error serializing lessonOrderJson", e);
            }

            // DO NOT reset progress for completed lessons! Student retains their completed status.
        }

        String reason;
        if (request.getWeakLessonTitles() != null && !request.getWeakLessonTitles().isEmpty()) {
            String titles = String.join(", ", request.getWeakLessonTitles());
            reason = "Điểm kiểm tra chủ đề đạt " + request.getScorePercentage() + "% (< 60%). Bạn cần củng cố nội dung: [" + titles + "]. Hệ thống đã bổ sung bài học bổ sung bên dưới để bạn ôn luyện trước khi làm lại bài kiểm tra.";
        } else {
            reason = "Điểm kiểm tra chủ đề đạt " + request.getScorePercentage() + "% (< 60%). Hệ thống đã bổ sung bài học bổ sung bên dưới để bạn ôn luyện trước khi làm lại bài kiểm tra.";
        }
        node.setRemedialReason(reason);
        studyPathSkillNodeRepository.save(node);

        return getMyStudyPath(request.getStudentId(), request.getSubjectId());
    }

    @Transactional
    public StudyPathDto completeCourseFinalTest(CompleteCourseTestRequest request) {
        log.info("Completing course final test for student={}, subject={}, score={}%",
                request.getStudentId(), request.getSubjectId(), request.getScorePercentage());

        StudyPathEntity path = studyPathRepository.findByStudentIdAndSubjectId(request.getStudentId(), request.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lộ trình học của học sinh"));

        path.setStatus("COMPLETED");
        path.setProgressPercentage(100);
        studyPathRepository.save(path);

        return getMyStudyPath(request.getStudentId(), request.getSubjectId());
    }

    private List<Map<String, Object>> fetchModulesWithTopics(UUID subjectId) {
        try {
            String url = contentServiceUrl + "/api/v1/content/subjects/" + subjectId + "/modules";
            ResponseEntity<Map<String, Object>> resp = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            if (resp.getBody() != null && resp.getBody().get("data") != null) {
                List<Map<String, Object>> modules = (List<Map<String, Object>>) resp.getBody().get("data");
                for (Map<String, Object> mod : modules) {
                    List<Map<String, Object>> topics = (List<Map<String, Object>>) mod.get("topics");
                    if (topics == null || topics.isEmpty()) {
                        try {
                            String tUrl = contentServiceUrl + "/api/v1/content/modules/" + mod.get("id") + "/topics";
                            ResponseEntity<Map<String, Object>> tResp = restTemplate.exchange(
                                    tUrl,
                                    HttpMethod.GET,
                                    null,
                                    new ParameterizedTypeReference<Map<String, Object>>() {}
                            );
                            if (tResp.getBody() != null && tResp.getBody().get("data") != null) {
                                mod.put("topics", tResp.getBody().get("data"));
                            }
                        } catch (Exception ignored) {}
                    }
                }
                return modules;
            }
        } catch (Exception e) {
            log.warn("Error fetching modules from content-service for subject {}: {}", subjectId, e.getMessage());
        }
        return Collections.emptyList();
    }
}
