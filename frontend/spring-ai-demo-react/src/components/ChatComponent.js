import React from "react";
import { useState } from "react";
function ChatComponent() {
    const [prompt, setPrompt] = useState('');
    const [chatResponse, setChatResponse] = useState('');
const askAI = async () => {
  try {
    const response = await fetch(
      `http://localhost:8102/ask-ai-options?prompt=${encodeURIComponent(prompt)}`
    );

    const data = await response.text();
    setChatResponse(data);

  } catch (error) {
    console.error("Error asking AI:", error);
  }
};
    return(
        <div>
        <h2>Talk to AI</h2>
        <input
        type="text"
        placeholder="Enter the prompt to AI"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={askAI}>Ask AI</button>
        <div className="output">
            <p>{chatResponse}</p>
        </div>
        </div>
    )
}
export default ChatComponent;