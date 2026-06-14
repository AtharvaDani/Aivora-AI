import { useState } from 'react';

const MOODS = [
  { emoji: '😊', label: 'Happy', prompt: 'celebration' },
  { emoji: '😴', label: 'Tired', prompt: 'quick easy 15 minutes' },
  { emoji: '💪', label: 'Healthy', prompt: 'healthy nutritious low calorie' },
  { emoji: '❤️', label: 'Romantic', prompt: 'romantic dinner for two' },
  { emoji: '🎉', label: 'Party', prompt: 'party snacks finger food' },
  { emoji: '🌧️', label: 'Cozy', prompt: 'comfort food warm cozy' },
];

const CUISINE_VIDEOS = {
  indian: 'https://www.youtube.com/results?search_query=indian+recipes',
  italian: 'https://www.youtube.com/results?search_query=italian+recipes',
  chinese: 'https://www.youtube.com/results?search_query=chinese+recipes',
  mexican: 'https://www.youtube.com/results?search_query=mexican+recipes',
  japanese: 'https://www.youtube.com/results?search_query=japanese+recipes',
  thai: 'https://www.youtube.com/results?search_query=thai+recipes',
  american: 'https://www.youtube.com/results?search_query=american+recipes',
  french: 'https://www.youtube.com/results?search_query=french+recipes',
  korean: 'https://www.youtube.com/results?search_query=korean+recipes',
};

function RecipeGenerator() {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [dietary, setDietary] = useState('');
  const [servings, setServings] = useState(2);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');
  const [savedRecipes, setSavedRecipes] = useState(
    JSON.parse(localStorage.getItem('savedRecipes') || '[]')
  );
  const [showSaved, setShowSaved] = useState(false);

  const getYTUrl = () => {
    if (!cuisine) return null;
    const key = cuisine.toLowerCase().trim();
    return CUISINE_VIDEOS[key] ||
      'https://www.youtube.com/results?search_query=' + encodeURIComponent(cuisine + ' recipes');
  };

  const openYoutube = () => {
    const url = getYTUrl();
    if (url) window.open(url, '_blank');
  };

  const generateRecipe = async () => {
    if (!ingredients) return;
    setLoading(true);
    setResponse('');
    setSaved(false);
    try {
      const res = await fetch(
        'http://localhost:8102/recipe-creator?ingredients='
        + encodeURIComponent(ingredients)
        + '&cuisine=' + (cuisine || 'any')
        + '&dietaryRestrictions=' + (dietary || 'none')
        + '&servings=' + servings
      );
      const text = await res.text();
      setResponse(text);
    } catch (err) {
      alert('Error generating recipe');
    }
    setLoading(false);
  };

  const saveRecipe = () => {
    const recipe = {
      id: Date.now(),
      ingredients,
      cuisine,
      response,
      date: new Date().toLocaleDateString()
    };
    const updated = [recipe, ...savedRecipes.slice(0, 9)];
    setSavedRecipes(updated);
    localStorage.setItem('savedRecipes', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const printRecipe = () => {
    const win = window.open('', '_blank');
    win.document.write(
      '<html><head><title>Recipe</title>'
      + '<style>body{font-family:Arial;padding:40px;}pre{white-space:pre-wrap;}</style>'
      + '</head><body>'
      + '<h1>Recipe by Aivoria AI</h1>'
      + '<p>Ingredients: ' + ingredients + '</p>'
      + '<p>Cuisine: ' + (cuisine || 'Any') + '</p>'
      + '<p>Servings: ' + servings + '</p>'
      + '<hr/><pre>' + response + '</pre>'
      + '</body></html>'
    );
    win.print();
  };

  const shareRecipe = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Recipe from Aivoria AI', text: response });
    } else {
      navigator.clipboard.writeText(response);
      alert('Recipe copied!');
    }
  };

  const handleMood = (mood) => {
    setSelectedMood(mood.label);
    setIngredients('');
    setCuisine(mood.prompt);
  };

  return (
    <div className="section">
      <h2>🍳 Recipe Generator</h2>

      <div className="mood-selector">
        <p className="suggestions-label">✦ What's your mood?</p>
        <div className="mood-grid">
          {MOODS.map((mood, i) => (
            <button
              key={i}
              className={selectedMood === mood.label ? 'mood-btn active' : 'mood-btn'}
              onClick={() => handleMood(mood)}>
              <span>{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="serving-size">
        <p className="suggestions-label">✦ Servings</p>
        <div className="serving-controls">
          <button
            className="serving-btn"
            onClick={() => setServings(Math.max(1, servings - 1))}>
            −
          </button>
          <span className="serving-number">{servings}</span>
          <button
            className="serving-btn"
            onClick={() => setServings(servings + 1)}>
            +
          </button>
        </div>
      </div>

      <div className="input-group">
        <label>Ingredients</label>
        <input
          type="text"
          placeholder="e.g. chicken, rice, tomato"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Cuisine Type</label>
        <input
          type="text"
          placeholder="e.g. Indian, Italian, Chinese"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
        />
        {cuisine && (
          <button
            onClick={openYoutube}
            className="youtube-link"
            style={{ textAlign: 'left', marginTop: '10px' }}>
            ▶ Watch {cuisine} cooking tutorials on YouTube →
          </button>
        )}
      </div>

      <div className="input-group">
        <label>Dietary Restrictions</label>
        <input
          type="text"
          placeholder="e.g. vegan, gluten-free, none"
          value={dietary}
          onChange={(e) => setDietary(e.target.value)}
        />
      </div>

      <button onClick={generateRecipe} disabled={loading}>
        {loading ? (
          <span className="loading-dots">
            <span></span><span></span><span></span>
          </span>
        ) : '🍳 Generate Recipe'}
      </button>

      {response && (
        <div className="response-box">
          <div className="response-header">
            <h3>Your Recipe</h3>
            <div className="response-actions">
              <button className="icon-btn" onClick={saveRecipe} title="Save">
                {saved ? '✅' : '🔖'}
              </button>
              <button className="icon-btn" onClick={printRecipe} title="Print">
                🖨️
              </button>
              <button className="icon-btn" onClick={shareRecipe} title="Share">
                🔗
              </button>
            </div>
          </div>
          <p>{response}</p>
          {cuisine && (
            <div className="youtube-card">
              <div className="youtube-card-left">
                <div className="yt-logo">▶</div>
                <div>
                  <p className="yt-title">Learn to cook {cuisine} cuisine</p>
                  <p className="yt-sub">Watch step-by-step tutorials on YouTube</p>
                </div>
              </div>
              <button onClick={openYoutube} className="yt-watch-btn">
                Watch Now
              </button>
            </div>
          )}
        </div>
      )}

      {savedRecipes.length > 0 && (
        <div className="saved-section">
          <button
            className="toggle-saved-btn"
            onClick={() => setShowSaved(!showSaved)}>
            {showSaved ? '▲ Hide' : '▼ Show'} Saved Recipes ({savedRecipes.length})
          </button>
          {showSaved && (
            <div className="saved-list">
              {savedRecipes.map((r) => (
                <div
                  key={r.id}
                  className="saved-item"
                  onClick={() => setResponse(r.response)}>
                  <span>🍳 {r.ingredients.substring(0, 40)}...</span>
                  <span className="history-time">{r.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeGenerator;