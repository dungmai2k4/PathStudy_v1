package com.studypath.content.repository;

import com.studypath.content.domain.SkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillRepository extends JpaRepository<SkillEntity, UUID> {
    List<SkillEntity> findBySubjectIdOrderByDisplayOrderAsc(UUID subjectId);
    Optional<SkillEntity> findByCode(String code);
    boolean existsByCode(String code);
}
