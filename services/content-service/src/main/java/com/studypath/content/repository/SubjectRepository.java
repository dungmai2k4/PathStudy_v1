package com.studypath.content.repository;

import com.studypath.content.domain.SubjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubjectRepository extends JpaRepository<SubjectEntity, UUID> {
    List<SubjectEntity> findAllByOrderByDisplayOrderAsc();
    Optional<SubjectEntity> findByCode(String code);
    Optional<SubjectEntity> findByName(String name);
    boolean existsByCode(String code);
}
