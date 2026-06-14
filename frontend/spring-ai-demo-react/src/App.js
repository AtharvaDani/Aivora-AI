import './App.css';
import { useState } from 'react';
import ImageGenerator from './components/ImageGenerator';
import ChatComponent from './components/ChatComponent';
import RecipeGenerator from './components/RecipeGenerator';

function App() {
  const [activeTab, setActiveTab] = useState('image-generator');

  return (
    <div className="App">
      {/* Animated Background */}
      <div className="bg-orbs">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">✦</div>
          <div className="logo-text">
            <h1>Aivora</h1>
            <span>AI</span>
          </div>
        </div>
        <nav className="nav">
          <button
            className={activeTab === 'image-generator' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('image-generator')}>
            <span className="nav-icon">🎨</span>
            Image Generator
          </button>
          <button
            className={activeTab === 'chat' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('chat')}>
            <span className="nav-icon">💬</span>
            Chat
          </button>
          <button
            className={activeTab === 'recipe-generator' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('recipe-generator')}>
            <span className="nav-icon">🍳</span>
            Recipe Generator
          </button>
        </nav>
      </header>

      {/* Hero */}
      <div className="hero">
        
        <h2 className="hero-title">
          {activeTab === 'image-generator' && 'Generate Stunning Images'}
          {activeTab === 'chat' && 'Chat with Intelligence'}
          {activeTab === 'recipe-generator' && 'Create Amazing Recipes'}
        </h2>
        <p className="hero-sub">Experience the future of AI — fast, creative, powerful</p>
      </div>

      {/* Content */}
      <main className="main">
        <div className="card-3d">
          {activeTab === 'image-generator' && <ImageGenerator />}
          {activeTab === 'chat' && <ChatComponent />}
          {activeTab === 'recipe-generator' && <RecipeGenerator />}
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 Aivora AI — Built with Spring Boot & React</p>
      </footer>
    </div>
  );
}

export default App;