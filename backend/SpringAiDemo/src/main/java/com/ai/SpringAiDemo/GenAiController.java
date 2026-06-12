package com.ai.SpringAiDemo;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GenAiController {

    private final ChatService chatService;
    private final ImageService imageService;
    private final RecipeService recipeService;  // ✅ fixed typo "priavate"

    public GenAiController(ChatService chatService,
                           ImageService imageService,
                           RecipeService recipeService) {  // ✅ added RecipeService
        this.chatService = chatService;
        this.imageService = imageService;
        this.recipeService = recipeService;  // ✅ added this line
    }

    @GetMapping("/ask-ai-options")
    public String getResponseOptions(
            @RequestParam String prompt) {
        return chatService.getResponseOptions(prompt);
    }

    @GetMapping("/generate-image")
    public ResponseEntity<byte[]> generateImage(
            @RequestParam String prompt) {
        byte[] image = imageService.generateImage(prompt);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(image);
    }

    @GetMapping("/recipe-creator")
    public String recipeCreator(
            @RequestParam String ingredients,
            @RequestParam(defaultValue = "any") String cuisine,
            @RequestParam(defaultValue = "none") String dietaryRestrictions) {
        return recipeService.createRecipe(ingredients, cuisine, dietaryRestrictions);
    }
}