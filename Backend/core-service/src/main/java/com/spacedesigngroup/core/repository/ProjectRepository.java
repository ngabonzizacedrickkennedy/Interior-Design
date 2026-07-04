package com.spacedesigngroup.core.repository;

import com.spacedesigngroup.core.model.ProjectRecord;
import com.spacedesigngroup.core.model.ProjectStatus;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<ProjectRecord, Long> {

    List<ProjectRecord> findByClientId(Long clientId);

    List<ProjectRecord> findByOperationalStatus(ProjectStatus status);

    Optional<ProjectRecord> findByRequestId(Long requestId);
}
