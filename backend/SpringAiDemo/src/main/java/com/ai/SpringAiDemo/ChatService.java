package com.ai.SpringAiDemo;


import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.stereotype.Service;
import org.springframework.ai.chat.prompt.Prompt;

@Service
public class ChatService {
    private final ChatModel chatModel;

    public ChatService(ChatModel chatModel){
        this.chatModel = chatModel;
    }

    public String getResponseOptions(String prompt){
        ChatResponse response = chatModel.call(
                new Prompt(prompt, OpenAiChatOptions.builder()
                        .model("llama-3.3-70b-versatile")
                        .build())
        );
        return response.getResult().getOutput().getText();
    }
}
