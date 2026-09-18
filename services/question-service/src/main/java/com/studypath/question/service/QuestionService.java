package com.studypath.question.service;

import com.studypath.question.domain.QuestionBankEntity;
import com.studypath.question.domain.QuestionEntity;
import com.studypath.question.domain.QuestionOptionEntity;
import com.studypath.question.dto.*;
import com.studypath.question.repository.QuestionBankRepository;
import com.studypath.question.repository.QuestionOptionRepository;
import com.studypath.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionBankRepository questionBankRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository questionOptionRepository;

    @Transactional(readOnly = true)
    public List<QuestionBankDto> getQuestionBanks(UUID subjectId) {
        List<QuestionBankEntity> banks = (subjectId != null)
                ? questionBankRepository.findBySubjectId(subjectId)
                : questionBankRepository.findAll();

        return banks.stream()
                .map(this::toQuestionBankDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuestionBankDto getQuestionBankById(UUID id) {
        return questionBankRepository.findById(id)
                .map(this::toQuestionBankDto)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ngân hàng câu hỏi ID: " + id));
    }

    @Transactional
    public QuestionBankDto createQuestionBank(CreateQuestionBankRequest request) {
        QuestionBankEntity entity = QuestionBankEntity.builder()
                .subjectId(request.getSubjectId())
                .name(request.getName())
                .description(request.getDescription())
                .status("ACTIVE")
                .build();
        entity = questionBankRepository.save(entity);
        return toQuestionBankDto(entity);
    }

    @Transactional
    public QuestionBankDto updateQuestionBank(UUID id, UpdateQuestionBankRequest request) {
        QuestionBankEntity entity = questionBankRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ngân hàng câu hỏi ID: " + id));
        entity.setName(request.getName());
        if (request.getDescription() != null) entity.setDescription(request.getDescription());
        if (request.getStatus() != null) entity.setStatus(request.getStatus());
        entity = questionBankRepository.save(entity);
        return toQuestionBankDto(entity);
    }

    @Transactional
    public void deleteQuestionBank(UUID id) {
        List<QuestionEntity> questions = questionRepository.findByQuestionBankId(id);
        for (QuestionEntity q : questions) {
            questionOptionRepository.deleteByQuestionId(q.getId());
            questionRepository.delete(q);
        }
        questionBankRepository.deleteById(id);
    }

    // --- Student Public Question Endpoints (Hidden isCorrect) ---

    @Transactional(readOnly = true)
    public List<QuestionDto> getQuestions(UUID questionBankId, UUID skillId, String difficulty) {
        return fetchQuestions(questionBankId, skillId, difficulty, false);
    }

    @Transactional(readOnly = true)
    public List<QuestionDto> getQuestionsForManager(UUID questionBankId, UUID skillId, String difficulty) {
        return fetchQuestions(questionBankId, skillId, difficulty, true);
    }

    private List<QuestionDto> fetchQuestions(UUID questionBankId, UUID skillId, String difficulty, boolean includeAnswer) {
        List<QuestionEntity> questions;

        if (skillId != null && difficulty != null && !difficulty.isBlank()) {
            questions = questionRepository.findBySkillIdAndDifficulty(skillId, difficulty);
        } else if (skillId != null) {
            questions = questionRepository.findBySkillId(skillId);
        } else if (questionBankId != null) {
            questions = questionRepository.findByQuestionBankId(questionBankId);
        } else {
            questions = questionRepository.findAll();
        }

        return questions.stream()
                .map(q -> toQuestionDto(q, includeAnswer))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuestionDto> getQuestionsByTopicId(UUID topicId) {
        List<QuestionEntity> questions = questionRepository.findByTopicId(topicId);
        if (questions.isEmpty()) {
            questions = questionRepository.findBySkillId(topicId);
        }
        return questions.stream()
                .map(q -> toQuestionDto(q, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuestionDto> getQuestionsBySubjectId(UUID subjectId) {
        List<QuestionBankEntity> banks = questionBankRepository.findBySubjectId(subjectId);
        return banks.stream()
                .flatMap(b -> questionRepository.findByQuestionBankId(b.getId()).stream())
                .map(q -> toQuestionDto(q, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuestionDto getQuestionById(UUID id, boolean includeAnswer) {
        return questionRepository.findById(id)
                .map(q -> toQuestionDto(q, includeAnswer))
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy câu hỏi ID: " + id));
    }

    @Transactional
    public QuestionDto createQuestion(CreateQuestionRequest request) {
        QuestionEntity question = QuestionEntity.builder()
                .questionBankId(request.getQuestionBankId())
                .skillId(request.getSkillId())
                .moduleId(request.getModuleId())
                .topicId(request.getTopicId())
                .content(request.getContent())
                .difficulty(request.getDifficulty().toUpperCase())
                .explanation(request.getExplanation())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .status("ACTIVE")
                .build();
        question = questionRepository.save(question);

        if (request.getOptions() != null) {
            int order = 1;
            for (CreateQuestionRequest.QuestionOptionInput optInput : request.getOptions()) {
                QuestionOptionEntity opt = QuestionOptionEntity.builder()
                        .questionId(question.getId())
                        .optionContent(optInput.getOptionContent())
                        .isCorrect(Boolean.TRUE.equals(optInput.getIsCorrect()))
                        .displayOrder(optInput.getDisplayOrder() != null ? optInput.getDisplayOrder() : order++)
                        .build();
                questionOptionRepository.save(opt);
            }
        }

        return toQuestionDto(question, true);
    }

    @Transactional
    public QuestionDto updateQuestion(UUID id, UpdateQuestionRequest request) {
        QuestionEntity question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy câu hỏi ID: " + id));

        question.setContent(request.getContent());
        if (request.getSkillId() != null) question.setSkillId(request.getSkillId());
        if (request.getModuleId() != null) question.setModuleId(request.getModuleId());
        if (request.getTopicId() != null) question.setTopicId(request.getTopicId());
        if (request.getDifficulty() != null) question.setDifficulty(request.getDifficulty().toUpperCase());
        if (request.getExplanation() != null) question.setExplanation(request.getExplanation());
        if (request.getStatus() != null) question.setStatus(request.getStatus());
        if (request.getDisplayOrder() != null) question.setDisplayOrder(request.getDisplayOrder());
        question = questionRepository.save(question);

        if (request.getOptions() != null && !request.getOptions().isEmpty()) {
            questionOptionRepository.deleteByQuestionId(question.getId());
            int order = 1;
            for (CreateQuestionRequest.QuestionOptionInput optInput : request.getOptions()) {
                QuestionOptionEntity opt = QuestionOptionEntity.builder()
                        .questionId(question.getId())
                        .optionContent(optInput.getOptionContent())
                        .isCorrect(Boolean.TRUE.equals(optInput.getIsCorrect()))
                        .displayOrder(optInput.getDisplayOrder() != null ? optInput.getDisplayOrder() : order++)
                        .build();
                questionOptionRepository.save(opt);
            }
        }

        return toQuestionDto(question, true);
    }

    @Transactional
    public void deleteQuestion(UUID id) {
        questionOptionRepository.deleteByQuestionId(id);
        questionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public CheckAnswerResponse checkAnswer(UUID questionId, UUID selectedOptionId) {
        QuestionEntity question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy câu hỏi ID: " + questionId));

        QuestionOptionEntity correctOption = questionOptionRepository.findByQuestionIdAndIsCorrectTrue(questionId)
                .orElseThrow(() -> new IllegalStateException("Câu hỏi chưa được cấu hình đáp án đúng"));

        boolean isCorrect = correctOption.getId().equals(selectedOptionId);

        return CheckAnswerResponse.builder()
                .isCorrect(isCorrect)
                .selectedOptionId(selectedOptionId)
                .correctOptionId(correctOption.getId())
                .explanation(question.getExplanation())
                .build();
    }

    private QuestionBankDto toQuestionBankDto(QuestionBankEntity entity) {
        long questionCount = questionRepository.findByQuestionBankId(entity.getId()).size();
        return QuestionBankDto.builder()
                .id(entity.getId())
                .subjectId(entity.getSubjectId())
                .name(entity.getName())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .questionCount(questionCount)
                .build();
    }

    private QuestionDto toQuestionDto(QuestionEntity entity, boolean includeAnswer) {
        List<QuestionOptionDto> options = questionOptionRepository.findByQuestionIdOrderByDisplayOrderAsc(entity.getId()).stream()
                .map(opt -> toQuestionOptionDto(opt, includeAnswer))
                .collect(Collectors.toList());

        return QuestionDto.builder()
                .id(entity.getId())
                .questionBankId(entity.getQuestionBankId())
                .topicId(entity.getTopicId() != null ? entity.getTopicId() : entity.getSkillId())
                .moduleId(entity.getModuleId())
                .skillId(entity.getSkillId())
                .content(entity.getContent())
                .difficulty(entity.getDifficulty())
                .explanation(includeAnswer ? entity.getExplanation() : null)
                .status(entity.getStatus())
                .displayOrder(entity.getDisplayOrder())
                .options(options)
                .build();
    }

    private QuestionOptionDto toQuestionOptionDto(QuestionOptionEntity entity, boolean includeAnswer) {
        return QuestionOptionDto.builder()
                .id(entity.getId())
                .questionId(entity.getQuestionId())
                .optionContent(entity.getOptionContent())
                .isCorrect(includeAnswer ? entity.getIsCorrect() : null)
                .displayOrder(entity.getDisplayOrder())
                .build();
    }
}
