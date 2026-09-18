package com.studypath.content.repository;

import com.studypath.content.domain.ExampleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExampleRepository extends JpaRepository<ExampleEntity, UUID> {
    List<ExampleEntity> findByLessonIdOrderByDisplayOrderAsc(UUID lessonId);
}
