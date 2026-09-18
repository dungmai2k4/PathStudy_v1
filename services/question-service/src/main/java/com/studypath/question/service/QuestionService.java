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
@Transactional(readOnly = true)
public class QuestionService {

    private final QuestionBankRepository questionBankRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository questionOptionRepository;

    public List<QuestionBankDto> getQuestionBanks(UUID subjectId) {
        List<QuestionBankEntity> banks = (subjectId != null)
                ? questionBankRepository.findBySubjectId(subjectId)
                : questionBankRepository.findAll();

        return banks.stream()
                .map(this::toQuestionBankDto)
                .collect(Collectors.toList());
    }

    public QuestionBankDto getQuestionBankById(UUID id) {
        return questionBankRepository.findById(id)
                .map(this::toQuestionBankDto)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ngân hàng câu hỏi ID: " + id));
    }

    public List<QuestionDto> getQuestions(UUID questionBankId, UUID skillId, String difficulty) {
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
                .map(this::toQuestionDto)
                .collect(Collectors.toList());
    }

    public List<QuestionDto> getQuestionsByTopicId(UUID topicId) {
        List<QuestionEntity> questions = questionRepository.findByTopicId(topicId);
        if (questions.isEmpty()) {
            // Fallback to skillId if topicId matches skillId
            questions = questionRepository.findBySkillId(topicId);
        }
        return questions.stream()
                .map(this::toQuestionDto)
                .collect(Collectors.toList());
    }

    public List<QuestionDto> getQuestionsBySubjectId(UUID subjectId) {
        List<QuestionBankEntity> banks = questionBankRepository.findBySubjectId(subjectId);
        return banks.stream()
                .flatMap(b -> questionRepository.findByQuestionBankId(b.getId()).stream())
                .map(this::toQuestionDto)
                .collect(Collectors.toList());
    }

    public QuestionDto getQuestionById(UUID id) {
        return questionRepository.findById(id)
                .map(this::toQuestionDto)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy câu hỏi ID: " + id));
    }

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

    private QuestionDto toQuestionDto(QuestionEntity entity) {
        List<QuestionOptionDto> options = questionOptionRepository.findByQuestionIdOrderByDisplayOrderAsc(entity.getId()).stream()
                .map(this::toQuestionOptionDto)
                .collect(Collectors.toList());

        return QuestionDto.builder()
                .id(entity.getId())
                .questionBankId(entity.getQuestionBankId())
                .topicId(entity.getTopicId() != null ? entity.getTopicId() : entity.getSkillId())
                .moduleId(entity.getModuleId())
                .skillId(entity.getSkillId())
                .content(entity.getContent())
                .difficulty(entity.getDifficulty())
                .explanation(entity.getExplanation())
                .status(entity.getStatus())
                .displayOrder(entity.getDisplayOrder())
                .options(options)
                .build();
    }

    private QuestionOptionDto toQuestionOptionDto(QuestionOptionEntity entity) {
        return QuestionOptionDto.builder()
                .id(entity.getId())
                .questionId(entity.getQuestionId())
                .optionContent(entity.getOptionContent())
                .isCorrect(entity.getIsCorrect())
                .displayOrder(entity.getDisplayOrder())
                .build();
    }
}
