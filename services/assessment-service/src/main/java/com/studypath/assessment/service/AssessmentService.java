package com.studypath.assessment.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.studypath.assessment.domain.*;
import com.studypath.assessment.dto.AssessmentDtos.*;
import com.studypath.assessment.repository.*;
import com.studypath.common.dto.ApiResponse;
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
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentQuestionRepository assessmentQuestionRepository;
    private final AssessmentAttemptRepository assessmentAttemptRepository;
    private final AssessmentAnswerRepository assessmentAnswerRepository;
    private final SkillAssessmentResultRepository skillAssessmentResultRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.services.question-url:http://localhost:8083}")
    private String questionServiceUrl;

    // Fixed UUIDs for English Skills
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
    public AssessmentTestDto generatePlacementTest(UUID subjectId, UUID studentId) {
        log.info("Generating placement test for subject: {} and student: {}", subjectId, studentId);

        // Fetch questions for each of the 6 skills
        List<Map<String, Object>> chosenQuestions = new ArrayList<>();

        for (Map.Entry<UUID, String> entry : ENGLISH_SKILLS.entrySet()) {
            UUID skillId = entry.getKey();
            String skillName = entry.getValue();

            List<Map<String, Object>> skillQuestions = fetchQuestionsForSkill(skillId);
            if (!skillQuestions.isEmpty()) {
                // Shuffle questions for this skill to ensure randomness across tests
                List<Map<String, Object>> shuffled = new ArrayList<>(skillQuestions);
                Collections.shuffle(shuffled);
                // Take 2 questions per skill (total 12 questions)
                int take = Math.min(2, shuffled.size());
                for (int i = 0; i < take; i++) {
                    Map<String, Object> q = shuffled.get(i);
                    q.put("resolvedSkillName", skillName);
                    chosenQuestions.add(q);
                }
            }
        }

        // Shuffle all selected questions so order is randomized across skills (not sequential by skill or DB order)
        Collections.shuffle(chosenQuestions);

        // Create Assessment Entity
        AssessmentEntity assessment = AssessmentEntity.builder()
                .subjectId(subjectId)
                .title("Khảo sát Năng lực Đầu vào Tiếng Anh THPT")
                .type("PLACEMENT")
                .timeLimitMinutes(12) // 12 minutes for 12 questions
                .totalQuestions(chosenQuestions.size())
                .passingScorePercentage(60)
                .build();
        assessment = assessmentRepository.save(assessment);

        // Save Question Entities
        List<AssessmentQuestionDto> dtoList = new ArrayList<>();
        int order = 1;

        for (Map<String, Object> q : chosenQuestions) {
            UUID qId = UUID.fromString((String) q.get("id"));
            UUID sId = UUID.fromString((String) q.get("skillId"));
            String sName = (String) q.getOrDefault("resolvedSkillName", "Tiếng Anh");
            String content = (String) q.get("content");
            String difficulty = (String) q.getOrDefault("difficulty", "MEDIUM");
            String explanation = (String) q.getOrDefault("explanation", "");

            List<Map<String, Object>> rawOptions = (List<Map<String, Object>>) q.get("options");
            UUID correctOptId = null;

            List<OptionDto> clientOptions = new ArrayList<>();
            for (Map<String, Object> opt : rawOptions) {
                UUID optId = UUID.fromString((String) opt.get("id"));
                String optContent = (String) opt.get("optionContent");
                Boolean isCorr = Boolean.TRUE.equals(opt.get("isCorrect"));
                if (isCorr) {
                    correctOptId = optId;
                }
                clientOptions.add(OptionDto.builder()
                        .id(optId)
                        .optionContent(optContent)
                        .build());
            }

            // Shuffle options for each question as well
            Collections.shuffle(clientOptions);

            String optionsJson = "";
            try {
                optionsJson = objectMapper.writeValueAsString(clientOptions);
            } catch (Exception e) {
                log.error("Error serializing options", e);
            }

            AssessmentQuestionEntity qEntity = AssessmentQuestionEntity.builder()
                    .assessmentId(assessment.getId())
                    .questionId(qId)
                    .skillId(sId)
                    .skillName(sName)
                    .content(content)
                    .difficulty(difficulty)
                    .optionsJson(optionsJson)
                    .correctOptionId(correctOptId != null ? correctOptId : UUID.randomUUID())
                    .explanation(explanation)
                    .displayOrder(order)
                    .build();
            assessmentQuestionRepository.save(qEntity);

            dtoList.add(AssessmentQuestionDto.builder()
                    .id(qEntity.getId())
                    .questionId(qId)
                    .skillId(sId)
                    .skillName(sName)
                    .content(content)
                    .difficulty(difficulty)
                    .displayOrder(order)
                    .options(clientOptions)
                    .build());

            order++;
        }

        // Create Assessment Attempt
        AssessmentAttemptEntity attempt = AssessmentAttemptEntity.builder()
                .assessmentId(assessment.getId())
                .studentId(studentId)
                .subjectId(subjectId)
                .assessmentType("PLACEMENT")
                .startedAt(Instant.now())
                .totalQuestions(chosenQuestions.size())
                .status("IN_PROGRESS")
                .build();
        attempt = assessmentAttemptRepository.save(attempt);

        return AssessmentTestDto.builder()
                .assessmentId(assessment.getId())
                .attemptId(attempt.getId())
                .title(assessment.getTitle())
                .assessmentType("PLACEMENT")
                .timeLimitMinutes(assessment.getTimeLimitMinutes())
                .totalQuestions(chosenQuestions.size())
                .questions(dtoList)
                .build();
    }

    @Transactional
    public AssessmentTestDto generateSkillTest(GenerateSkillTestRequest request) {
        log.info("Generating milestone test for skill: {}", request.getSkillId());

        List<Map<String, Object>> skillQuestions = fetchQuestionsForSkill(request.getSkillId());
        List<Map<String, Object>> shuffled = new ArrayList<>(skillQuestions);
        Collections.shuffle(shuffled);

        int take = Math.min(5, shuffled.size());
        List<Map<String, Object>> chosen = shuffled.subList(0, take);

        String skillName = request.getSkillName() != null ? request.getSkillName() : ENGLISH_SKILLS.getOrDefault(request.getSkillId(), "Kiểm tra kỹ năng");

        // Exactly 1 minute per question for English!
        int timeLimit = chosen.size(); // 1 min per question -> 5 min

        AssessmentEntity assessment = AssessmentEntity.builder()
                .subjectId(request.getSubjectId())
                .skillId(request.getSkillId())
                .title("Kiểm tra Đánh giá Kỹ năng: " + skillName)
                .type("SKILL_TEST")
                .timeLimitMinutes(timeLimit)
                .totalQuestions(chosen.size())
                .passingScorePercentage(80)
                .build();
        assessment = assessmentRepository.save(assessment);

        List<AssessmentQuestionDto> dtoList = new ArrayList<>();
        int order = 1;

        for (Map<String, Object> q : chosen) {
            UUID qId = UUID.fromString((String) q.get("id"));
            UUID sId = request.getSkillId();
            String content = (String) q.get("content");
            String difficulty = (String) q.getOrDefault("difficulty", "MEDIUM");
            String explanation = (String) q.getOrDefault("explanation", "");

            List<Map<String, Object>> rawOptions = (List<Map<String, Object>>) q.get("options");
            UUID correctOptId = null;

            List<OptionDto> clientOptions = new ArrayList<>();
            for (Map<String, Object> opt : rawOptions) {
                UUID optId = UUID.fromString((String) opt.get("id"));
                String optContent = (String) opt.get("optionContent");
                Boolean isCorr = Boolean.TRUE.equals(opt.get("isCorrect"));
                if (isCorr) {
                    correctOptId = optId;
                }
                clientOptions.add(OptionDto.builder()
                        .id(optId)
                        .optionContent(optContent)
                        .build());
            }

            Collections.shuffle(clientOptions);

            String optionsJson = "";
            try {
                optionsJson = objectMapper.writeValueAsString(clientOptions);
            } catch (Exception e) {
                log.error("Error serializing options", e);
            }

            AssessmentQuestionEntity qEntity = AssessmentQuestionEntity.builder()
                    .assessmentId(assessment.getId())
                    .questionId(qId)
                    .skillId(sId)
                    .skillName(skillName)
                    .content(content)
                    .difficulty(difficulty)
                    .optionsJson(optionsJson)
                    .correctOptionId(correctOptId != null ? correctOptId : UUID.randomUUID())
                    .explanation(explanation)
                    .displayOrder(order)
                    .build();
            assessmentQuestionRepository.save(qEntity);

            dtoList.add(AssessmentQuestionDto.builder()
                    .id(qEntity.getId())
                    .questionId(qId)
                    .skillId(sId)
                    .skillName(skillName)
                    .content(content)
                    .difficulty(difficulty)
                    .displayOrder(order)
                    .options(clientOptions)
                    .build());

            order++;
        }

        AssessmentAttemptEntity attempt = AssessmentAttemptEntity.builder()
                .assessmentId(assessment.getId())
                .studentId(request.getStudentId())
                .subjectId(request.getSubjectId())
                .skillId(request.getSkillId())
                .skillName(skillName)
                .assessmentType("SKILL_TEST")
                .startedAt(Instant.now())
                .totalQuestions(chosen.size())
                .status("IN_PROGRESS")
                .build();
        attempt = assessmentAttemptRepository.save(attempt);

        return AssessmentTestDto.builder()
                .assessmentId(assessment.getId())
                .attemptId(attempt.getId())
                .title(assessment.getTitle())
                .assessmentType("SKILL_TEST")
                .timeLimitMinutes(timeLimit)
                .totalQuestions(chosen.size())
                .questions(dtoList)
                .build();
    }

    @Transactional
    public AssessmentTestDto generateTopicTest(GenerateTopicTestRequest request) {
        log.info("Generating milestone test for topic: {}", request.getTopicId());

        List<Map<String, Object>> topicQuestions = fetchQuestionsForTopic(request.getTopicId());
        if (topicQuestions.isEmpty()) {
            topicQuestions = fetchQuestionsForSkill(request.getTopicId());
        }

        List<Map<String, Object>> shuffled = new ArrayList<>(topicQuestions);
        Collections.shuffle(shuffled);

        int take = Math.min(5, shuffled.size());
        List<Map<String, Object>> chosen = shuffled.subList(0, take);

        String topicName = request.getTopicName() != null ? request.getTopicName() : "Bài kiểm tra Topic";
        int timeLimit = Math.max(3, chosen.size()); // 1 min per question

        AssessmentEntity assessment = AssessmentEntity.builder()
                .subjectId(request.getSubjectId())
                .topicId(request.getTopicId())
                .skillId(request.getTopicId())
                .title("Kiểm tra Đánh giá Topic: " + topicName)
                .type("TOPIC_TEST")
                .timeLimitMinutes(timeLimit)
                .totalQuestions(chosen.size())
                .passingScorePercentage(80)
                .build();
        assessment = assessmentRepository.save(assessment);

        List<AssessmentQuestionDto> dtoList = new ArrayList<>();
        int order = 1;

        for (Map<String, Object> q : chosen) {
            UUID qId = UUID.fromString((String) q.get("id"));
            UUID tId = request.getTopicId();
            String content = (String) q.get("content");
            String difficulty = (String) q.getOrDefault("difficulty", "MEDIUM");
            String explanation = (String) q.getOrDefault("explanation", "");

            List<Map<String, Object>> rawOptions = (List<Map<String, Object>>) q.get("options");
            UUID correctOptId = null;

            List<OptionDto> clientOptions = new ArrayList<>();
            if (rawOptions != null) {
                for (Map<String, Object> opt : rawOptions) {
                    UUID optId = UUID.fromString((String) opt.get("id"));
                    String optContent = (String) opt.get("optionContent");
                    Boolean isCorr = Boolean.TRUE.equals(opt.get("isCorrect"));
                    if (isCorr) {
                        correctOptId = optId;
                    }
                    clientOptions.add(OptionDto.builder()
                            .id(optId)
                            .optionContent(optContent)
                            .build());
                }
            }

            Collections.shuffle(clientOptions);

            String optionsJson = "";
            try {
                optionsJson = objectMapper.writeValueAsString(clientOptions);
            } catch (Exception e) {
                log.error("Error serializing options", e);
            }

            AssessmentQuestionEntity qEntity = AssessmentQuestionEntity.builder()
                    .assessmentId(assessment.getId())
                    .questionId(qId)
                    .skillId(tId)
                    .skillName(topicName)
                    .content(content)
                    .difficulty(difficulty)
                    .optionsJson(optionsJson)
                    .correctOptionId(correctOptId != null ? correctOptId : UUID.randomUUID())
                    .explanation(explanation)
                    .displayOrder(order)
                    .build();
            assessmentQuestionRepository.save(qEntity);

            dtoList.add(AssessmentQuestionDto.builder()
                    .id(qEntity.getId())
                    .questionId(qId)
                    .topicId(tId)
                    .skillId(tId)
                    .skillName(topicName)
                    .content(content)
                    .difficulty(difficulty)
                    .displayOrder(order)
                    .options(clientOptions)
                    .build());

            order++;
        }

        AssessmentAttemptEntity attempt = AssessmentAttemptEntity.builder()
                .assessmentId(assessment.getId())
                .studentId(request.getStudentId())
                .subjectId(request.getSubjectId())
                .topicId(request.getTopicId())
                .topicName(topicName)
                .skillId(request.getTopicId())
                .skillName(topicName)
                .assessmentType("TOPIC_TEST")
                .startedAt(Instant.now())
                .totalQuestions(chosen.size())
                .status("IN_PROGRESS")
                .build();
        attempt = assessmentAttemptRepository.save(attempt);

        return AssessmentTestDto.builder()
                .assessmentId(assessment.getId())
                .attemptId(attempt.getId())
                .title(assessment.getTitle())
                .assessmentType("TOPIC_TEST")
                .timeLimitMinutes(timeLimit)
                .totalQuestions(chosen.size())
                .questions(dtoList)
                .build();
    }

    @Transactional
    public AssessmentTestDto generateCourseFinalTest(GenerateCourseTestRequest request) {
        log.info("Generating final comprehensive course test for subject: {}", request.getSubjectId());

        List<Map<String, Object>> allQuestions = fetchQuestionsForSubject(request.getSubjectId());
        if (allQuestions.isEmpty()) {
            for (UUID sId : ENGLISH_SKILLS.keySet()) {
                allQuestions.addAll(fetchQuestionsForSkill(sId));
            }
        }

        List<Map<String, Object>> shuffled = new ArrayList<>(allQuestions);
        Collections.shuffle(shuffled);

        int take = Math.min(15, shuffled.size());
        List<Map<String, Object>> chosen = shuffled.subList(0, take);

        int timeLimit = Math.max(15, chosen.size()); // 15 min

        AssessmentEntity assessment = AssessmentEntity.builder()
                .subjectId(request.getSubjectId())
                .title("Bài test kiểm tra lại kiến thức tổng thể môn học")
                .type("COURSE_FINAL_TEST")
                .timeLimitMinutes(timeLimit)
                .totalQuestions(chosen.size())
                .passingScorePercentage(80)
                .build();
        assessment = assessmentRepository.save(assessment);

        List<AssessmentQuestionDto> dtoList = new ArrayList<>();
        int order = 1;

        for (Map<String, Object> q : chosen) {
            UUID qId = UUID.fromString((String) q.get("id"));
            UUID sId = q.get("skillId") != null ? UUID.fromString((String) q.get("skillId")) : request.getSubjectId();
            String sName = ENGLISH_SKILLS.getOrDefault(sId, "Kiến thức tổng hợp");
            String content = (String) q.get("content");
            String difficulty = (String) q.getOrDefault("difficulty", "MEDIUM");
            String explanation = (String) q.getOrDefault("explanation", "");

            List<Map<String, Object>> rawOptions = (List<Map<String, Object>>) q.get("options");
            UUID correctOptId = null;

            List<OptionDto> clientOptions = new ArrayList<>();
            if (rawOptions != null) {
                for (Map<String, Object> opt : rawOptions) {
                    UUID optId = UUID.fromString((String) opt.get("id"));
                    String optContent = (String) opt.get("optionContent");
                    Boolean isCorr = Boolean.TRUE.equals(opt.get("isCorrect"));
                    if (isCorr) {
                        correctOptId = optId;
                    }
                    clientOptions.add(OptionDto.builder()
                            .id(optId)
                            .optionContent(optContent)
                            .build());
                }
            }

            Collections.shuffle(clientOptions);

            String optionsJson = "";
            try {
                optionsJson = objectMapper.writeValueAsString(clientOptions);
            } catch (Exception e) {
                log.error("Error serializing options", e);
            }

            AssessmentQuestionEntity qEntity = AssessmentQuestionEntity.builder()
                    .assessmentId(assessment.getId())
                    .questionId(qId)
                    .skillId(sId)
                    .skillName(sName)
                    .content(content)
                    .difficulty(difficulty)
                    .optionsJson(optionsJson)
                    .correctOptionId(correctOptId != null ? correctOptId : UUID.randomUUID())
                    .explanation(explanation)
                    .displayOrder(order)
                    .build();
            assessmentQuestionRepository.save(qEntity);

            dtoList.add(AssessmentQuestionDto.builder()
                    .id(qEntity.getId())
                    .questionId(qId)
                    .skillId(sId)
                    .skillName(sName)
                    .content(content)
                    .difficulty(difficulty)
                    .displayOrder(order)
                    .options(clientOptions)
                    .build());

            order++;
        }

        AssessmentAttemptEntity attempt = AssessmentAttemptEntity.builder()
                .assessmentId(assessment.getId())
                .studentId(request.getStudentId())
                .subjectId(request.getSubjectId())
                .assessmentType("COURSE_FINAL_TEST")
                .startedAt(Instant.now())
                .totalQuestions(chosen.size())
                .status("IN_PROGRESS")
                .build();
        attempt = assessmentAttemptRepository.save(attempt);

        return AssessmentTestDto.builder()
                .assessmentId(assessment.getId())
                .attemptId(attempt.getId())
                .title(assessment.getTitle())
                .assessmentType("COURSE_FINAL_TEST")
                .timeLimitMinutes(timeLimit)
                .totalQuestions(chosen.size())
                .questions(dtoList)
                .build();
    }

    @Transactional
    public AssessmentResultDto submitAssessment(UUID attemptId, SubmitAssessmentRequest request) {
        AssessmentAttemptEntity attempt = assessmentAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lượt làm bài ID: " + attemptId));

        AssessmentEntity assessment = assessmentRepository.findById(attempt.getAssessmentId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đề thi"));

        List<AssessmentQuestionEntity> questions = assessmentQuestionRepository.findByAssessmentIdOrderByDisplayOrderAsc(assessment.getId());

        // Map submitted answers by questionId
        Map<UUID, UUID> answersMap = new HashMap<>();
        if (request.getAnswers() != null) {
            for (AnswerItem item : request.getAnswers()) {
                answersMap.put(item.getQuestionId(), item.getSelectedOptionId());
            }
        }

        int totalScore = 0;
        Map<UUID, List<Boolean>> skillAccuracyMap = new HashMap<>();
        Map<UUID, String> skillNames = new HashMap<>();
        List<AnswerDetailDto> details = new ArrayList<>();

        for (AssessmentQuestionEntity q : questions) {
            UUID selectedOpt = answersMap.get(q.getQuestionId());
            boolean isCorrect = selectedOpt != null && selectedOpt.equals(q.getCorrectOptionId());

            if (isCorrect) totalScore++;

            // Save individual answer
            AssessmentAnswerEntity answerEntity = AssessmentAnswerEntity.builder()
                    .attemptId(attemptId)
                    .questionId(q.getQuestionId())
                    .selectedOptionId(selectedOpt)
                    .correctOptionId(q.getCorrectOptionId())
                    .isCorrect(isCorrect)
                    .build();
            assessmentAnswerRepository.save(answerEntity);

            // Group by skill
            skillAccuracyMap.computeIfAbsent(q.getSkillId(), k -> new ArrayList<>()).add(isCorrect);
            skillNames.put(q.getSkillId(), q.getSkillName());

            details.add(AnswerDetailDto.builder()
                    .questionId(q.getQuestionId())
                    .content(q.getContent())
                    .selectedOptionId(selectedOpt)
                    .correctOptionId(q.getCorrectOptionId())
                    .isCorrect(isCorrect)
                    .explanation(q.getExplanation())
                    .build());
        }

        int totalQ = questions.size();
        int accuracy = totalQ > 0 ? Math.round((float) totalScore * 100 / totalQ) : 0;
        int passing = assessment.getPassingScorePercentage() != null ? assessment.getPassingScorePercentage() : 80;
        boolean passed = accuracy >= passing;

        attempt.setSubmittedAt(Instant.now());
        attempt.setScore(totalScore);
        attempt.setAccuracyPercentage(accuracy);
        attempt.setIsPassed(passed);
        attempt.setStatus("COMPLETED");
        assessmentAttemptRepository.save(attempt);

        // Build skill breakdown
        List<SkillResultDto> breakdown = new ArrayList<>();
        for (Map.Entry<UUID, List<Boolean>> entry : skillAccuracyMap.entrySet()) {
            UUID sId = entry.getKey();
            List<Boolean> list = entry.getValue();
            int sTotal = list.size();
            int sCorrect = (int) list.stream().filter(Boolean::booleanValue).count();
            int sAcc = sTotal > 0 ? Math.round((float) sCorrect * 100 / sTotal) : 0;

            String prof;
            if (sAcc >= 85) {
                prof = "MASTERY"; // Xuất sắc
            } else if (sAcc >= 60) {
                prof = "PROFICIENT"; // Đạt
            } else {
                prof = "NEEDS_IMPROVEMENT"; // Cần củng cố
            }

            SkillAssessmentResultEntity skillRes = SkillAssessmentResultEntity.builder()
                    .attemptId(attemptId)
                    .skillId(sId)
                    .skillName(skillNames.getOrDefault(sId, "Kỹ năng"))
                    .totalQuestions(sTotal)
                    .correctCount(sCorrect)
                    .accuracyPercentage(sAcc)
                    .proficiencyLevel(prof)
                    .build();
            skillAssessmentResultRepository.save(skillRes);

            breakdown.add(SkillResultDto.builder()
                    .skillId(sId)
                    .skillName(skillNames.getOrDefault(sId, "Kỹ năng"))
                    .totalQuestions(sTotal)
                    .correctCount(sCorrect)
                    .accuracyPercentage(sAcc)
                    .proficiencyLevel(prof)
                    .build());
        }

        return AssessmentResultDto.builder()
                .attemptId(attempt.getId())
                .assessmentId(assessment.getId())
                .title(assessment.getTitle())
                .assessmentType(attempt.getAssessmentType())
                .subjectId(attempt.getSubjectId())
                .skillId(attempt.getSkillId())
                .skillName(attempt.getSkillName())
                .score(totalScore)
                .totalQuestions(totalQ)
                .accuracyPercentage(accuracy)
                .isPassed(passed)
                .startedAt(attempt.getStartedAt())
                .submittedAt(attempt.getSubmittedAt())
                .skillBreakdown(breakdown)
                .answerDetails(details)
                .build();
    }

    @Transactional(readOnly = true)
    public AssessmentResultDto getAttemptResult(UUID attemptId) {
        AssessmentAttemptEntity attempt = assessmentAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy kết quả làm bài: " + attemptId));

        AssessmentEntity assessment = assessmentRepository.findById(attempt.getAssessmentId()).orElse(null);

        List<SkillAssessmentResultEntity> skillResults = skillAssessmentResultRepository.findByAttemptId(attemptId);
        List<SkillResultDto> breakdown = skillResults.stream()
                .map(s -> SkillResultDto.builder()
                        .skillId(s.getSkillId())
                        .skillName(s.getSkillName())
                        .totalQuestions(s.getTotalQuestions())
                        .correctCount(s.getCorrectCount())
                        .accuracyPercentage(s.getAccuracyPercentage())
                        .proficiencyLevel(s.getProficiencyLevel())
                        .build())
                .collect(Collectors.toList());

        List<AssessmentAnswerEntity> answers = assessmentAnswerRepository.findByAttemptId(attemptId);
        List<AnswerDetailDto> details = new ArrayList<>();
        for (AssessmentAnswerEntity a : answers) {
            details.add(AnswerDetailDto.builder()
                    .questionId(a.getQuestionId())
                    .selectedOptionId(a.getSelectedOptionId())
                    .correctOptionId(a.getCorrectOptionId())
                    .isCorrect(a.getIsCorrect())
                    .build());
        }

        return AssessmentResultDto.builder()
                .attemptId(attempt.getId())
                .assessmentId(attempt.getAssessmentId())
                .title(assessment != null ? assessment.getTitle() : "Bài kiểm tra")
                .assessmentType(attempt.getAssessmentType())
                .subjectId(attempt.getSubjectId())
                .skillId(attempt.getSkillId())
                .skillName(attempt.getSkillName())
                .score(attempt.getScore())
                .totalQuestions(attempt.getTotalQuestions())
                .accuracyPercentage(attempt.getAccuracyPercentage())
                .isPassed(attempt.getIsPassed())
                .startedAt(attempt.getStartedAt())
                .submittedAt(attempt.getSubmittedAt())
                .skillBreakdown(breakdown)
                .answerDetails(details)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AssessmentAttemptSummaryDto> getAssessmentHistory(UUID studentId, String type) {
        List<AssessmentAttemptEntity> list;
        if (type != null && !type.isBlank()) {
            list = assessmentAttemptRepository.findByStudentIdAndAssessmentTypeOrderByCreatedAtDesc(studentId, type);
        } else {
            list = assessmentAttemptRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        }

        return list.stream().map(a -> AssessmentAttemptSummaryDto.builder()
                .attemptId(a.getId())
                .assessmentType(a.getAssessmentType())
                .title(a.getSkillName() != null ? "Kiểm tra: " + a.getSkillName() : "Bài kiểm tra đánh giá")
                .skillId(a.getSkillId())
                .skillName(a.getSkillName())
                .score(a.getScore())
                .totalQuestions(a.getTotalQuestions())
                .accuracyPercentage(a.getAccuracyPercentage())
                .isPassed(a.getIsPassed())
                .startedAt(a.getStartedAt())
                .submittedAt(a.getSubmittedAt() != null ? a.getSubmittedAt() : a.getCreatedAt())
                .createdAt(a.getCreatedAt())
                .build()).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AssessmentAttemptSummaryDto> getSkillTestHistory(UUID studentId, UUID skillId) {
        List<AssessmentAttemptEntity> list = assessmentAttemptRepository.findByStudentIdAndSkillIdOrderByCreatedAtDesc(studentId, skillId);
        return list.stream().map(a -> AssessmentAttemptSummaryDto.builder()
                .attemptId(a.getId())
                .assessmentType(a.getAssessmentType())
                .title("Kiểm tra: " + (a.getSkillName() != null ? a.getSkillName() : "Kỹ năng"))
                .topicId(a.getTopicId())
                .topicName(a.getTopicName())
                .skillId(a.getSkillId())
                .skillName(a.getSkillName())
                .score(a.getScore())
                .totalQuestions(a.getTotalQuestions())
                .accuracyPercentage(a.getAccuracyPercentage())
                .isPassed(a.getIsPassed())
                .startedAt(a.getStartedAt())
                .submittedAt(a.getSubmittedAt() != null ? a.getSubmittedAt() : a.getCreatedAt())
                .createdAt(a.getCreatedAt())
                .build()).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AssessmentAttemptSummaryDto> getTopicTestHistory(UUID studentId, UUID topicId) {
        List<AssessmentAttemptEntity> list = assessmentAttemptRepository.findByStudentIdAndTopicIdOrderByCreatedAtDesc(studentId, topicId);
        if (list.isEmpty()) {
            list = assessmentAttemptRepository.findByStudentIdAndSkillIdOrderByCreatedAtDesc(studentId, topicId);
        }
        return list.stream().map(a -> AssessmentAttemptSummaryDto.builder()
                .attemptId(a.getId())
                .assessmentType(a.getAssessmentType())
                .title("Kiểm tra Topic: " + (a.getTopicName() != null ? a.getTopicName() : a.getSkillName()))
                .subjectId(a.getSubjectId())
                .topicId(a.getTopicId() != null ? a.getTopicId() : a.getSkillId())
                .topicName(a.getTopicName() != null ? a.getTopicName() : a.getSkillName())
                .skillId(a.getSkillId())
                .skillName(a.getSkillName())
                .score(a.getScore())
                .totalQuestions(a.getTotalQuestions())
                .accuracyPercentage(a.getAccuracyPercentage())
                .isPassed(a.getIsPassed())
                .startedAt(a.getStartedAt())
                .submittedAt(a.getSubmittedAt() != null ? a.getSubmittedAt() : a.getCreatedAt())
                .createdAt(a.getCreatedAt())
                .build()).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AssessmentAttemptSummaryDto> getSubjectTestHistory(UUID studentId, UUID subjectId) {
        List<AssessmentAttemptEntity> list = assessmentAttemptRepository.findByStudentIdAndSubjectIdAndAssessmentTypeOrderByCreatedAtDesc(
                studentId, subjectId, "COURSE_FINAL_TEST");
        return list.stream().map(a -> AssessmentAttemptSummaryDto.builder()
                .attemptId(a.getId())
                .assessmentType(a.getAssessmentType())
                .title("Bài test tổng thể môn học")
                .subjectId(a.getSubjectId())
                .score(a.getScore())
                .totalQuestions(a.getTotalQuestions())
                .accuracyPercentage(a.getAccuracyPercentage())
                .isPassed(a.getIsPassed())
                .startedAt(a.getStartedAt())
                .submittedAt(a.getSubmittedAt() != null ? a.getSubmittedAt() : a.getCreatedAt())
                .createdAt(a.getCreatedAt())
                .build()).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssessmentAttemptEntity getLatestPlacementAttempt(UUID studentId, UUID subjectId) {
        return assessmentAttemptRepository
                .findFirstByStudentIdAndSubjectIdAndAssessmentTypeOrderByCreatedAtDesc(studentId, subjectId, "PLACEMENT")
                .orElse(null);
    }

    private List<Map<String, Object>> fetchQuestionsForSkill(UUID skillId) {
        try {
            String url = questionServiceUrl + "/api/v1/questions?skillId=" + skillId;
            ResponseEntity<Map<String, Object>> resp = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            if (resp.getBody() != null && resp.getBody().get("data") != null) {
                return (List<Map<String, Object>>) resp.getBody().get("data");
            }
        } catch (Exception e) {
            log.error("Error fetching questions for skill {}: {}", skillId, e.getMessage());
        }
        return Collections.emptyList();
    }

    private List<Map<String, Object>> fetchQuestionsForTopic(UUID topicId) {
        try {
            String url = questionServiceUrl + "/api/v1/questions/by-topic/" + topicId;
            ResponseEntity<Map<String, Object>> resp = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            if (resp.getBody() != null && resp.getBody().get("data") != null) {
                return (List<Map<String, Object>>) resp.getBody().get("data");
            }
        } catch (Exception e) {
            log.warn("Error fetching questions for topic {}: {}. Falling back to skillId query.", topicId, e.getMessage());
        }
        return Collections.emptyList();
    }

    private List<Map<String, Object>> fetchQuestionsForSubject(UUID subjectId) {
        try {
            String url = questionServiceUrl + "/api/v1/questions/by-subject/" + subjectId;
            ResponseEntity<Map<String, Object>> resp = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            if (resp.getBody() != null && resp.getBody().get("data") != null) {
                return (List<Map<String, Object>>) resp.getBody().get("data");
            }
        } catch (Exception e) {
            log.warn("Error fetching questions for subject {}: {}", subjectId, e.getMessage());
        }
        return Collections.emptyList();
    }
}
