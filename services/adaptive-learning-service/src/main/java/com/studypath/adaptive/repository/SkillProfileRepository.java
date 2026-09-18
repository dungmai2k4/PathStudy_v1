package com.studypath.adaptive.repository;

import com.studypath.adaptive.domain.SkillProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillProfileRepository extends JpaRepository<SkillProfileEntity, UUID> {
    List<SkillProfileEntity> findByStudentIdAndSubjectId(UUID studentId, UUID subjectId);
    Optional<SkillProfileEntity> findByStudentIdAndSkillId(UUID studentId, UUID skillId);
}
