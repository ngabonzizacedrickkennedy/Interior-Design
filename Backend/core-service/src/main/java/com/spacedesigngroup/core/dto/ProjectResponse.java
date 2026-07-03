package com.spacedesigngroup.core.dto;

import com.spacedesigngroup.core.model.MilestoneItem;
import com.spacedesigngroup.core.model.ProjectStatus;

import java.util.List;

public record ProjectResponse(
        Long id,
        Long clientId,
        String clientName,
        List<MilestoneItem> milestones,
        Integer visualProgressPercent,
        ProjectStatus operationalStatus
) {}
