import React from 'react';
import './ImageSuggestions.css';

function ImageSuggestions({ prompts, platform, onSelect, selectedIndex }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Image prompt copied to clipboard!');
  };

  return (
    <div className="image-suggestions">
      <h3>Image Suggestions</h3>
      <p className="section-description">
        {prompts.length} image prompts for {platform}
      </p>

      <div className="prompts-list">
        {prompts.map((prompt, index) => (
          <div 
            key={index}
            className={`prompt-card ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => onSelect(index)}
          >
            <div className="prompt-header">
              <span className="prompt-number">#{index + 1}</span>
              <span className="ratio-badge">{prompt.ratio}</span>
            </div>

            <div className="prompt-content">
              <div className="prompt-field">
                <label>Image Prompt</label>
                <p className="prompt-text">{prompt.prompt}</p>
              </div>

              <div className="prompt-meta">
                <div className="meta-item">
                  <label>Style</label>
                  <p>{prompt.style}</p>
                </div>

                <div className="meta-item">
                  <label>Mood</label>
                  <p>{prompt.mood}</p>
                </div>
              </div>

              {prompt.elements && prompt.elements.length > 0 && (
                <div className="prompt-field">
                  <label>Key Elements</label>
                  <div className="elements-tags">
                    {prompt.elements.map((element, i) => (
                      <span key={i} className="element-tag">{element}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              className="copy-button"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(prompt.prompt);
              }}
            >
              Copy Prompt
            </button>
          </div>
        ))}
      </div>

      <div className="usage-note">
        <strong>💡 Usage:</strong> Copy these prompts to use with DALL-E, Midjourney, Stable Diffusion, or share with your design team.
      </div>
    </div>
  );
}

export default ImageSuggestions;
