package com.studypath.auth.domain;

import com.studypath.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "student_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileEntity extends BaseEntity {

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "grade")
    private Integer grade;

    @Column(name = "class_name", length = 50)
    private String className;
}
