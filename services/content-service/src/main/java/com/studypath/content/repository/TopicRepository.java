package com.studypath.content.repository;

import com.studypath.content.domain.TopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TopicRepository extends JpaRepository<TopicEntity, UUID> {
    List<TopicEntity> findByModuleIdOrderByDisplayOrderAsc(UUID moduleId);
}
