package com.studypath.adaptive.repository;

import com.studypath.adaptive.domain.StudyPathEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudyPathRepository extends JpaRepository<StudyPathEntity, UUID> {
    List<StudyPathEntity> findByStudentId(UUID studentId);
    Optional<StudyPathEntity> findByStudentIdAndSubjectId(UUID studentId, UUID subjectId);
    boolean existsByStudentIdAndSubjectId(UUID studentId, UUID subjectId);
}
