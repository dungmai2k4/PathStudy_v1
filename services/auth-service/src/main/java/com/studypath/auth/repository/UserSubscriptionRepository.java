package com.studypath.auth.repository;

import com.studypath.auth.domain.UserSubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscriptionEntity, UUID> {

    @Query("SELECT s FROM UserSubscriptionEntity s WHERE s.userId = :userId AND s.status = 'ACTIVE' AND s.endDate > :now ORDER BY s.endDate DESC")
    List<UserSubscriptionEntity> findActiveSubscriptions(@Param("userId") UUID userId, @Param("now") Instant now);

    @Query("SELECT DISTINCT s.userId FROM UserSubscriptionEntity s WHERE s.userId IN :userIds AND s.status = 'ACTIVE' AND s.endDate > :now")
    java.util.Set<UUID> findActiveSubscriptionUserIds(@Param("userIds") java.util.Collection<UUID> userIds, @Param("now") Instant now);

    Optional<UserSubscriptionEntity> findTopByUserIdOrderByEndDateDesc(UUID userId);
}
