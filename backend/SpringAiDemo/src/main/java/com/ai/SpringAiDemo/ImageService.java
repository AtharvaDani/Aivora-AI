package com.ai.SpringAiDemo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@Service
public class ImageService {

    @Value("${cloudflare.account-id}")
    private String accountId;

    @Value("${cloudflare.api-token}")
    private String apiToken;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public byte[] generateImage(String prompt) {

        String url =
                "https://api.cloudflare.com/client/v4/accounts/"
                        + accountId
                        + "/ai/run/@cf/black-forest-labs/flux-1-schnell";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody =
                "{\"prompt\":\"" + prompt + "\"}";

        HttpEntity<String> request =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.POST,
                        request,
                        String.class
                );

        try {
            JsonNode root = objectMapper.readTree(response.getBody());

            String base64Image = root
                    .path("result")
                    .path("image")
                    .asText();

            byte[] imageBytes =
                    Base64.getDecoder().decode(base64Image);

            System.out.println(
                    "Generated image size: "
                            + imageBytes.length
                            + " bytes"
            );

            return imageBytes;

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to process Cloudflare image response",
                    e
            );
        }
    }
}