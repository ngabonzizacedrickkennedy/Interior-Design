package com.spacedesigngroup.core.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    private ServiceRequest request;

    @Column(columnDefinition = "TEXT")
    private String milestoneChecklistJson;

    @Builder.Default
    private Integer visualProgressPercent = 0;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProjectStatus operationalStatus = ProjectStatus.PLANNING;
}
