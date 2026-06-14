import { useState } from 'react';

const PROMPT_SUGGESTIONS = [
  "A futuristic city at night with neon lights",
  "A cute cartoon dog playing in the park",
  "A sunset over snow-capped mountains",
  "An underwater world with colorful fish",
  "A magical forest with glowing mushrooms",
  "A astronaut floating in space",
];

function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloaded, setDownloaded] = useState(false);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);
    return interval;
  };

  const generateImage = async () => {
    if (!prompt) return;
    setLoading(true);
    setImageUrl('');
    setDownloaded(false);
    const interval = simulateProgress();
    try {
      const res = await fetch(
        `http://localhost:8102/generate-image?prompt=${encodeURIComponent(prompt)}`
      );
      const blob = await res.blob();
      clearInterval(interval);
      setProgress(100);
      setImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      alert('Error generating image');
    }
    setLoading(false);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `aivoria-${Date.now()}.png`;
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleSuggestion = (suggestion) => {
    setPrompt(suggestion);
  };

  return (
    <div className="section">
      <h2>🎨 Image Generator</h2>

      {/* Prompt Suggestions */}
      <div className="suggestions">
        <p className="suggestions-label">✦ Try these prompts</p>
        <div className="suggestions-grid">
          {PROMPT_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              className="suggestion-chip"
              onClick={() => handleSuggestion(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <label>Enter Prompt</label>
        <textarea
          rows="4"
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="char-count">{prompt.length} characters</div>
      </div>

      <button onClick={generateImage} disabled={loading}>
        {loading ? (
          <span className="loading-dots">
            <span></span><span></span><span></span>
          </span>
        ) : '🎨 Generate Image'}
      </button>

      {/* Progress Bar */}
      {loading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}>
            </div>
          </div>
          <p className="progress-text">Generating... {progress}%</p>
        </div>
      )}

      {imageUrl && (
        <div className="image-container">
          <img src={imageUrl} alt="Generated" />
          <div className="image-actions">
            <button
              className="action-btn download-btn"
              onClick={downloadImage}>
              {downloaded ? '✅ Downloaded!' : '⬇️ Download Image'}
            </button>
            <button
              className="action-btn regenerate-btn"
              onClick={generateImage}>
              🔄 Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;