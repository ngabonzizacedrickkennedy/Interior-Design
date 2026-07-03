package com.spacedesigngroup.core.service;

import com.spacedesigngroup.core.dto.AnalyticsSnapshot;
import com.spacedesigngroup.core.model.ProjectStatus;
import com.spacedesigngroup.core.model.QuotationStatus;
import com.spacedesigngroup.core.model.RequestStatus;
import com.spacedesigngroup.core.repository.ClientRepository;
import com.spacedesigngroup.core.repository.FeedbackRepository;
import com.spacedesigngroup.core.repository.ProjectRepository;
import com.spacedesigngroup.core.repository.QuotationRepository;
import com.spacedesigngroup.core.repository.ServiceRequestRepository;
import com.spacedesigngroup.core.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final ClientRepository clientRepository;
    private final ServiceRequestRepository requestRepository;
    private final QuotationRepository quotationRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final FeedbackRepository feedbackRepository;

    public AnalyticsSnapshot buildSnapshot() {
        long totalClients = clientRepository.count();
        long totalRequests = requestRepository.count();
        long approvedRequests = requestRepository.findByExecutionStatus(RequestStatus.APPROVED).size()
                + requestRepository.findByExecutionStatus(RequestStatus.IN_PROGRESS).size()
                + requestRepository.findByExecutionStatus(RequestStatus.COMPLETED).size();

        var allProjects = projectRepository.findAll();
        long totalProjects = allProjects.size();
        long activeProjects = allProjects.stream()
                .filter(p -> p.getOperationalStatus() == ProjectStatus.ACTIVE).count();
        double avgProgress = allProjects.isEmpty() ? 0 :
                allProjects.stream().mapToInt(p -> p.getVisualProgressPercent()).average().orElse(0);

        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.findAll().stream()
                .filter(t -> Boolean.TRUE.equals(t.getIsCompleted())).count();
        double taskRate = totalTasks == 0 ? 0 :
                Math.round(100.0 * completedTasks / totalTasks) / 100.0;

        Double avgRating = feedbackRepository.computeAverageRating();
        long totalQuotations = quotationRepository.count();
        long approvedQuotations = quotationRepository.findAll().stream()
                .filter(q -> q.getApprovalState() == QuotationStatus.APPROVED).count();

        return new AnalyticsSnapshot(
                totalClients, totalRequests, approvedRequests,
                totalProjects, activeProjects, avgProgress,
                totalTasks, completedTasks, taskRate,
                avgRating, totalQuotations, approvedQuotations
        );
    }
}
