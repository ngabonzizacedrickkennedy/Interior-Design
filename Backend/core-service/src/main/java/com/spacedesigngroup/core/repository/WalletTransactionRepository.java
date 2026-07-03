package com.spacedesigngroup.core.repository;

import com.spacedesigngroup.core.model.WalletTransaction;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

    List<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);
}
