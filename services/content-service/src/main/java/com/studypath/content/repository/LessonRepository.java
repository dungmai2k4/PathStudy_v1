package com.studypath.content.repository;

import com.studypath.content.domain.LessonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<LessonEntity, UUID> {
    List<LessonEntity> findBySkillIdOrderByDisplayOrderAsc(UUID skillId);
    List<LessonEntity> findByTopicIdOrderByDisplayOrderAsc(UUID topicId);
    List<LessonEntity> findByTopicIdAndIsRemedialOrderByDisplayOrderAsc(UUID topicId, Boolean isRemedial);
    long countBySkillId(UUID skillId);
}
