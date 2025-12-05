import React from 'react';
import './CopyVariations.css';

function CopyVariations({ variations, onSelect, selectedIndex }) {
  const getRiskBadgeClass = (label) => {
    if (label === 'Safe & Clear') return 'risk-badge safe';
    if (label === 'Aggressive / Risky') return 'risk-badge risky';
    return 'risk-badge medium';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="copy-variations">
      <h3>Copy Variations</h3>
      <p className="section-description">
        {variations.length} variations generated
      </p>

      <div className="variations-list">
        {variations.map((variation, index) => (
          <div 
            key={index} 
            className={`variation-card ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => onSelect(index)}
          >
            <div className="variation-header">
              <span className="variation-number">#{index + 1}</span>
              {variation.performance_analysis && (
                <span className={getRiskBadgeClass(variation.performance_analysis.label)}>
                  {variation.performance_analysis.label}
                </span>
              )}
            </div>

            <div className="variation-content">
              <div className="copy-field">
                <label>Headline</label>
                <p className="headline">{variation.headline}</p>
              </div>

              <div className="copy-field">
                <label>Primary Text</label>
                <p>{variation.primary_text}</p>
              </div>

              <div className="copy-field">
                <label>Call to Action</label>
                <p className="cta">{variation.cta}</p>
              </div>

              {variation.notes && (
                <div className="copy-field">
                  <label>Notes</label>
                  <p className="notes">{variation.notes}</p>
                </div>
              )}

              {variation.performance_analysis && (
                <div className="performance-details">
                  <small>{variation.performance_analysis.details}</small>
                  {variation.performance_analysis.requires_review && (
                    <small className="review-required">⚠️ Compliance review recommended</small>
                  )}
                </div>
              )}
            </div>

            <button 
              className="copy-button"
              onClick={(e) => {
                e.stopPropagation();
                const fullText = `Headline: ${variation.headline}\n\nBody: ${variation.primary_text}\n\nCTA: ${variation.cta}`;
                copyToClipboard(fullText);
              }}
            >
              Copy Text
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CopyVariations;
