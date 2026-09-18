package com.studypath.content.repository;

import com.studypath.content.domain.MiniQuizEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MiniQuizRepository extends JpaRepository<MiniQuizEntity, UUID> {
    List<MiniQuizEntity> findByLessonId(UUID lessonId);
}
