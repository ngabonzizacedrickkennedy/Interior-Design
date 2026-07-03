package com.spacedesigngroup.core.service;

import com.spacedesigngroup.core.common.exception.AiAssessmentFailedException;
import com.spacedesigngroup.core.dto.ai.AiAssessRequestPayload;
import com.spacedesigngroup.core.dto.ai.AiAssessResultPayload;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class AiServiceClient {

    private final RestClient restClient;

    public AiServiceClient(@Value("${app.ai-service-url}") String baseUrl) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5_000);
        factory.setReadTimeout(120_000);

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .build();
    }

    public AiAssessResultPayload assess(AiAssessRequestPayload payload) {
        try {
            AiAssessResultPayload result = restClient.post()
                    .uri("/assess")
                    .body(payload)
                    .retrieve()
                    .body(AiAssessResultPayload.class);
            if (result == null) {
                throw new AiAssessmentFailedException("ai-service returned an empty response");
            }
            return result;
        } catch (RestClientException ex) {
            throw new AiAssessmentFailedException("ai-service could not produce a valid assessment", ex);
        }
    }
}
