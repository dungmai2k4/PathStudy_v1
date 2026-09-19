package com.studypath.payment.repository;

import com.studypath.payment.domain.PaymentOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentOrderRepository extends JpaRepository<PaymentOrderEntity, UUID> {

    Optional<PaymentOrderEntity> findByOrderCode(String orderCode);

    List<PaymentOrderEntity> findAllByUserIdOrderByCreatedAtDesc(UUID userId);

    boolean existsByOrderCode(String orderCode);
}
