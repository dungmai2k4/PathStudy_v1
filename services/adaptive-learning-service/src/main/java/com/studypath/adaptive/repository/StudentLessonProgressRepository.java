package com.studypath.adaptive.repository;

import com.studypath.adaptive.domain.StudentLessonProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentLessonProgressRepository extends JpaRepository<StudentLessonProgressEntity, UUID> {
    List<StudentLessonProgressEntity> findByStudentIdAndTopicId(UUID studentId, UUID topicId);
    Optional<StudentLessonProgressEntity> findByStudentIdAndLessonId(UUID studentId, UUID lessonId);
    List<StudentLessonProgressEntity> findByStudentId(UUID studentId);
}
