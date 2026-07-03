package com.spacedesigngroup.core.controller;

import com.spacedesigngroup.core.service.TaskService;


import com.spacedesigngroup.core.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF','PROJECT_MANAGER','ADMIN')")
    public List<TaskResponse> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF','PROJECT_MANAGER','ADMIN')")
    public TaskResponse getById(@PathVariable Long id) { return service.findById(id); }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('STAFF','PROJECT_MANAGER','ADMIN')")
    public List<TaskResponse> getByProject(@PathVariable Long projectId) {
        return service.findByProject(projectId);
    }

    @GetMapping("/designer/{designerId}")
    @PreAuthorize("hasAnyRole('STAFF','PROJECT_MANAGER','ADMIN')")
    public List<TaskResponse> getByDesigner(@PathVariable Long designerId) {
        return service.findByDesigner(designerId);
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER','ADMIN')")
    public List<TaskResponse> getOverdue() { return service.findOverdue(); }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER','ADMIN')")
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasAnyRole('STAFF','PROJECT_MANAGER','ADMIN')")
    public TaskResponse toggle(@PathVariable Long id) { return service.toggleCompletion(id); }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER','ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
