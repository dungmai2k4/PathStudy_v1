package com.studypath.question.repository;

import com.studypath.question.domain.QuestionBankEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionBankRepository extends JpaRepository<QuestionBankEntity, UUID> {
    List<QuestionBankEntity> findBySubjectId(UUID subjectId);
    boolean existsByName(String name);
}
