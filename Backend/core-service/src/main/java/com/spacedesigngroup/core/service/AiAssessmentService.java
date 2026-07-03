package com.spacedesigngroup.core.service;

import com.spacedesigngroup.core.auth.User;
import com.spacedesigngroup.core.common.exception.ConflictException;
import com.spacedesigngroup.core.common.exception.ResourceNotFoundException;
import com.spacedesigngroup.core.dto.AiAssessmentResponse;
import com.spacedesigngroup.core.dto.BudgetAdjustRequest;
import com.spacedesigngroup.core.dto.ai.*;
import com.spacedesigngroup.core.model.*;
import com.spacedesigngroup.core.repository.AiAssessmentRepository;
import com.spacedesigngroup.core.repository.RequestAttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AiAssessmentService {

    private final AiAssessmentRepository assessmentRepository;
    private final RequestAttachmentRepository attachmentRepository;
    private final ServiceRequestService serviceRequestService;
    private final AiServiceClient aiServiceClient;
    private final S3Service s3Service;

    public AiAssessmentResponse trigger(Long requestId, User caller) {
        ServiceRequest request = serviceRequestService.getOwnedOrThrow(requestId, caller);

        boolean hasRoomPhoto = attachmentRepository.countByRequestIdAndCategory(requestId, AttachmentCategory.ROOM_PHOTO) > 0;
        if (!hasRoomPhoto) {
            throw new IllegalArgumentException("At least one room photo is required before requesting an assessment");
        }

        AiAssessRequestPayload payload = buildPayload(request);
        AiAssessResultPayload result = aiServiceClient.assess(payload);

        AssessmentVerdict verdict = AssessmentVerdict.valueOf(result.verdict());
        AiAssessment assessment = AiAssessment.builder()
                .request(request)
                .verdict(verdict)
                .recommendedBudgetMin(result.recommendedBudgetMin())
                .recommendedBudgetMax(result.recommendedBudgetMax())
                .reasoning(result.reasoning())
                .styleSummary(result.styleSummary())
                .roomConditionSummary(result.roomConditionSummary())
                .status(verdict == AssessmentVerdict.SUFFICIENT
                        ? AssessmentAcknowledgement.ACKNOWLEDGED
                        : AssessmentAcknowledgement.PENDING)
                .build();
        assessment = assessmentRepository.save(assessment);
        return toResponse(assessment);
    }

    public List<AiAssessmentResponse> history(Long requestId, User caller) {
        serviceRequestService.getOwnedOrThrow(requestId, caller);
        return assessmentRepository.findByRequestIdOrderByCreatedAtDesc(requestId).stream()
                .map(this::toResponse).toList();
    }

    public AiAssessmentResponse latest(Long requestId, User caller) {
        serviceRequestService.getOwnedOrThrow(requestId, caller);
        AiAssessment assessment = assessmentRepository.findFirstByRequestIdOrderByCreatedAtDesc(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("No assessment exists yet for this request"));
        return toResponse(assessment);
    }

    public AiAssessmentResponse remain(Long requestId, Long assessmentId, Long callerUserId) {
        serviceRequestService.getOwnedOrThrow(requestId, callerUserId);
        AiAssessment assessment = assessmentRepository.findByIdAndRequestId(assessmentId, requestId)
                .orElseThrow(() -> ResourceNotFoundException.forEntity("AiAssessment", assessmentId));
        assessment.setStatus(AssessmentAcknowledgement.ACKNOWLEDGED);
        return toResponse(assessmentRepository.save(assessment));
    }

    public com.spacedesigngroup.core.dto.ServiceRequestResponse adjustBudget(Long requestId, Long callerUserId, BudgetAdjustRequest body) {
        ServiceRequest request = serviceRequestService.getOwnedOrThrow(requestId, callerUserId);
        if (request.getInvestmentStatus() == InvestmentStatus.INVESTED) {
            throw new ConflictException("This request has already been invested in and its budget can no longer be adjusted");
        }
        request.setBudgetLimit(body.newBudget());

        assessmentRepository.findFirstByRequestIdOrderByCreatedAtDesc(requestId).ifPresent(latest -> {
            if (latest.getStatus() == AssessmentAcknowledgement.PENDING) {
                latest.setStatus(AssessmentAcknowledgement.ADJUSTED);
                assessmentRepository.save(latest);
            }
        });

        return serviceRequestService.toResponseById(request.getId());
    }

    private AiAssessRequestPayload buildPayload(ServiceRequest request) {
        AiDimensionsPayload dimensions = new AiDimensionsPayload(
                request.getLengthMeters(),
                request.getWidthMeters(),
                request.getCeilingHeightMeters(),
                request.getSpatialNotes()
        );
        AiSpaceUsagePayload spaceUsage = new AiSpaceUsagePayload(
                request.isWorksFromHome(),
                request.isEntertainsOften(),
                request.isHasKids(),
                request.isHasPets(),
                request.getStorageNeeds()
        );
        AiLightingPayload lighting = new AiLightingPayload(
                request.getWindowDirection() != null ? request.getWindowDirection().name() : null,
                request.getNaturalLightLevel() != null ? request.getNaturalLightLevel().name() : null,
                request.getArtificialLightingNotes()
        );
        List<String> styleTags = request.getStyleTags().stream().map(Enum::name).toList();
        List<AiAttachmentPayload> attachments = attachmentRepository.findByRequestId(request.getId()).stream()
                .map(a -> new AiAttachmentPayload(a.getCategory().name(), s3Service.publicUrl(a.getS3Key()), a.getNote()))
                .toList();

        return new AiAssessRequestPayload(
                request.getId(),
                request.getRoomType(),
                request.getRequestDetails(),
                dimensions,
                request.getBudgetMin(),
                request.getBudgetMax(),
                styleTags,
                spaceUsage,
                lighting,
                request.getTimeline() != null ? request.getTimeline().name() : null,
                request.getAvoidNotes(),
                request.getSourcingLocation(),
                attachments
        );
    }

    private AiAssessmentResponse toResponse(AiAssessment a) {
        return new AiAssessmentResponse(
                a.getId(),
                a.getRequest().getId(),
                a.getVerdict(),
                a.getRecommendedBudgetMin(),
                a.getRecommendedBudgetMax(),
                a.getReasoning(),
                a.getStyleSummary(),
                a.getRoomConditionSummary(),
                a.getStatus(),
                a.getCreatedAt()
        );
    }
}
