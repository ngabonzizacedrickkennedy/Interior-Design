package com.spacedesigngroup.core.repository;

import com.spacedesigngroup.core.model.FeedbackLog;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<FeedbackLog, Long> {

    List<FeedbackLog> findByProjectId(Long projectId);

    @Query("SELECT AVG(f.metricRatingScore) FROM FeedbackLog f")
    Double computeAverageRating();
}
