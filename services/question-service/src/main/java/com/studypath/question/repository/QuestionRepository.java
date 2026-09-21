package com.studypath.question.repository;

import com.studypath.question.domain.QuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<QuestionEntity, UUID> {
    List<QuestionEntity> findByQuestionBankId(UUID questionBankId);
    List<QuestionEntity> findByQuestionBankIdAndDifficulty(UUID questionBankId, String difficulty);
    List<QuestionEntity> findBySkillId(UUID skillId);
    List<QuestionEntity> findBySkillIdAndDifficulty(UUID skillId, String difficulty);
    List<QuestionEntity> findByDifficulty(String difficulty);
    List<QuestionEntity> findByTopicId(UUID topicId);
    List<QuestionEntity> findByModuleId(UUID moduleId);
    long countByQuestionBankId(UUID questionBankId);
}
