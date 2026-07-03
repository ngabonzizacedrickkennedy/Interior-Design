package com.spacedesigngroup.core.controller;

import com.spacedesigngroup.core.service.ProjectService;


import com.spacedesigngroup.core.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF','PROJECT_MANAGER','ADMIN')")
    public List<ProjectResponse> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT','STAFF','PROJECT_MANAGER','ADMIN')")
    public ProjectResponse getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('CLIENT','PROJECT_MANAGER','ADMIN')")
    public List<ProjectResponse> getByClient(@PathVariable Long clientId) {
        return service.findByClient(clientId);
    }

    @PatchMapping("/{id}/milestones")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER','ADMIN')")
    public ProjectResponse updateMilestones(@PathVariable Long id,
                                             @Valid @RequestBody MilestoneUpdateRequest request) {
        return service.updateMilestones(id, request);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER','ADMIN')")
    public ProjectResponse updateStatus(@PathVariable Long id,
                                         @Valid @RequestBody ProjectStatusUpdateRequest request) {
        return service.updateStatus(id, request);
    }
}
