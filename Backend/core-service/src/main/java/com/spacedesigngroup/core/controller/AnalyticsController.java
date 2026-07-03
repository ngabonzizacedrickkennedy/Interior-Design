package com.spacedesigngroup.core.controller;

import com.spacedesigngroup.core.service.AnalyticsService;


import com.spacedesigngroup.core.dto.AnalyticsSnapshot;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER','ADMIN')")
    public AnalyticsSnapshot getSnapshot() {
        return service.buildSnapshot();
    }
}
