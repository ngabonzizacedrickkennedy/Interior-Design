package com.spacedesigngroup.core.service;

import com.spacedesigngroup.core.model.ProjectRecord;
import com.spacedesigngroup.core.model.MilestoneItem;
import com.spacedesigngroup.core.model.ProjectStatus;
import com.spacedesigngroup.core.repository.ProjectRepository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spacedesigngroup.core.common.exception.ResourceNotFoundException;
import com.spacedesigngroup.core.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ObjectMapper objectMapper;

    public List<ProjectResponse> findAll() {
        return projectRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<ProjectResponse> findByClient(Long clientId) {
        return projectRepository.findByClientId(clientId).stream().map(this::toResponse).toList();
    }

    public ProjectResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public ProjectResponse updateMilestones(Long id, MilestoneUpdateRequest request) {
        ProjectRecord project = getOrThrow(id);
        project.setMilestoneChecklistJson(toJson(request.milestones()));
        recalculateProgress(project, request.milestones());
        return toResponse(projectRepository.save(project));
    }

    public ProjectResponse updateStatus(Long id, ProjectStatusUpdateRequest request) {
        ProjectRecord project = getOrThrow(id);
        project.setOperationalStatus(request.operationalStatus());
        return toResponse(projectRepository.save(project));
    }

    private void recalculateProgress(ProjectRecord project, List<MilestoneItem> milestones) {
        if (milestones.isEmpty()) {
            project.setVisualProgressPercent(0);
            return;
        }
        long achieved = milestones.stream().filter(MilestoneItem::isAchieved).count();
        int percent = (int) Math.round(100.0 * achieved / milestones.size());
        project.setVisualProgressPercent(percent);
        if (percent == 100) {
            project.setOperationalStatus(ProjectStatus.COMPLETED);
        } else if (percent > 0) {
            project.setOperationalStatus(ProjectStatus.ACTIVE);
        }
    }

    public ProjectRecord getOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forEntity("ProjectRecord", id));
    }

    private ProjectResponse toResponse(ProjectRecord p) {
        return new ProjectResponse(
                p.getId(),
                p.getClient().getId(),
                p.getClient().getContactName(),
                parseMilestones(p.getMilestoneChecklistJson()),
                p.getVisualProgressPercent(),
                p.getOperationalStatus()
        );
    }

    private List<MilestoneItem> parseMilestones(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }

    private String toJson(List<MilestoneItem> milestones) {
        try {
            return objectMapper.writeValueAsString(milestones);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }
}
