import { useState, useEffect, useRef } from 'react';

function ChatComponent() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [listening, setListening] = useState(false);
  const typewriterRef = useRef(null);

  // Typewriter Effect
  useEffect(() => {
    if (response) {
      setDisplayedResponse('');
      let i = 0;
      clearInterval(typewriterRef.current);
      typewriterRef.current = setInterval(() => {
        if (i < response.length) {
          setDisplayedResponse(prev => prev + response[i]);
          i++;
        } else {
          clearInterval(typewriterRef.current);
        }
      }, 15);
    }
    return () => clearInterval(typewriterRef.current);
  }, [response]);

  const askAI = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse('');
    setDisplayedResponse('');
    try {
      const res = await fetch(
        `http://localhost:8102/ask-ai-options?prompt=${encodeURIComponent(prompt)}`
      );
      const text = await res.text();
      setResponse(text);
      setHistory(prev => [{
        question: prompt,
        answer: text,
        time: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 4)]);
    } catch (err) {
      alert('Error connecting to AI');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported in this browser. Use Chrome!');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => {
      setPrompt(e.results[0][0].transcript);
    };
    recognition.start();
  };

  const speakResponse = () => {
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="section">
      <h2>💬 Chat with AI</h2>

      {/* Chat History */}
      {history.length > 0 && (
        <div className="chat-history">
          <p className="history-label">✦ Recent Chats</p>
          {history.map((item, i) => (
            <div
              key={i}
              className="history-item"
              onClick={() => setPrompt(item.question)}>
              <span className="history-q">Q: {item.question.substring(0, 50)}...</span>
              <span className="history-time">{item.time}</span>
            </div>
          ))}
        </div>
      )}

      <div className="input-group">
        <label>Your Question</label>
        <div className="textarea-wrapper">
          <textarea
            rows="4"
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) askAI();
            }}
          />
          <button
            className="voice-btn"
            onClick={startVoiceInput}
            title="Voice Input">
            {listening ? '🔴' : '🎤'}
          </button>
        </div>
        <p className="hint">Press Ctrl+Enter to send</p>
      </div>

      <button onClick={askAI} disabled={loading}>
        {loading ? (
          <span className="loading-dots">
            <span></span><span></span><span></span>
          </span>
        ) : '💬 Ask AI'}
      </button>

      {displayedResponse && (
        <div className="response-box">
          <div className="response-header">
            <h3>Response</h3>
            <div className="response-actions">
              <button
                className="icon-btn"
                onClick={copyToClipboard}
                title="Copy">
                {copied ? '✅' : '📋'}
              </button>
              <button
                className="icon-btn"
                onClick={speakResponse}
                title="Read Aloud">
                🔊
              </button>
            </div>
          </div>
          <p>{displayedResponse}</p>
          {displayedResponse.length < response.length && (
            <span className="cursor">|</span>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatComponent;