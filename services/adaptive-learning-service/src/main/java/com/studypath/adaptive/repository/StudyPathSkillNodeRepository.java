package com.studypath.adaptive.repository;

import com.studypath.adaptive.domain.StudyPathSkillNodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudyPathSkillNodeRepository extends JpaRepository<StudyPathSkillNodeEntity, UUID> {
    List<StudyPathSkillNodeEntity> findByStudyPathIdOrderBySequenceOrderAsc(UUID studyPathId);
    Optional<StudyPathSkillNodeEntity> findByStudyPathIdAndSkillId(UUID studyPathId, UUID skillId);
    Optional<StudyPathSkillNodeEntity> findByStudyPathIdAndSequenceOrder(UUID studyPathId, Integer sequenceOrder);
    void deleteByStudyPathId(UUID studyPathId);
}
