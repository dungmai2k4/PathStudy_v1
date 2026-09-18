package com.studypath.question.repository;

import com.studypath.question.domain.QuestionOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuestionOptionRepository extends JpaRepository<QuestionOptionEntity, UUID> {
    List<QuestionOptionEntity> findByQuestionIdOrderByDisplayOrderAsc(UUID questionId);
    Optional<QuestionOptionEntity> findByQuestionIdAndIsCorrectTrue(UUID questionId);
}
