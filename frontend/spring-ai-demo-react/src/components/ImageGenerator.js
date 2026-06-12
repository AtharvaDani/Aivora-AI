import { useState } from 'react';

function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;
    setLoading(true);
    setImageUrl('');
    try {
      const res = await fetch(
        `http://localhost:8102/generate-image?prompt=${encodeURIComponent(prompt)}`
      );
      const blob = await res.blob();
      setImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert('Error generating image');
    }
    setLoading(false);
  };

  return (
    <div className="section">
      <h2>Image Generator</h2>
      <div className="input-group">
        <label>Enter Prompt</label>
        <textarea
          rows="4"
          placeholder="Describe the image..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <button onClick={generateImage} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      {imageUrl && (
        <div className="image-container">
          <img src={imageUrl} alt="Generated" />
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;