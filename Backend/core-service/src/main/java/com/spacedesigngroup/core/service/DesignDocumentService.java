package com.spacedesigngroup.core.service;

import com.spacedesigngroup.core.common.exception.ResourceNotFoundException;
import com.spacedesigngroup.core.dto.DocumentRequest;
import com.spacedesigngroup.core.dto.DocumentResponse;
import com.spacedesigngroup.core.model.DesignDocument;
import com.spacedesigngroup.core.model.DocumentStatus;
import com.spacedesigngroup.core.repository.DesignDocumentRepository;
import com.spacedesigngroup.core.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DesignDocumentService {

    private final DesignDocumentRepository documentRepository;
    private final ProjectRepository projectRepository;

    public List<DocumentResponse> findAll() {
        return documentRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<DocumentResponse> findByProject(Long projectId) {
        return documentRepository.findByProjectId(projectId).stream().map(this::toResponse).toList();
    }

    public DocumentResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public DocumentResponse upload(DocumentRequest request) {
        var project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> ResourceNotFoundException.forEntity("ProjectRecord", request.projectId()));
        DesignDocument doc = DesignDocument.builder()
                .project(project)
                .fileStorageUrl(request.fileStorageUrl())
                .fileVersion(1)
                .approvalBadgeStatus(DocumentStatus.PENDING)
                .build();
        return toResponse(documentRepository.save(doc));
    }

    public DocumentResponse incrementVersion(Long id) {
        DesignDocument doc = getOrThrow(id);
        doc.setFileVersion(doc.getFileVersion() + 1);
        doc.setApprovalBadgeStatus(DocumentStatus.PENDING);
        return toResponse(documentRepository.save(doc));
    }

    public DocumentResponse updateStatus(Long id, DocumentStatus status) {
        DesignDocument doc = getOrThrow(id);
        doc.setApprovalBadgeStatus(status);
        return toResponse(documentRepository.save(doc));
    }

    private DesignDocument getOrThrow(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forEntity("DesignDocument", id));
    }

    private DocumentResponse toResponse(DesignDocument d) {
        return new DocumentResponse(d.getId(), d.getProject().getId(),
                d.getFileStorageUrl(), d.getFileVersion(), d.getApprovalBadgeStatus());
    }
}
