import React, { useState } from 'react';
import CopyVariations from './CopyVariations';
import ImageSuggestions from './ImageSuggestions';
import PlatformPreview from './PlatformPreview';
import './ResultsDashboard.css';

function ResultsDashboard({ results, onReset, onSave }) {
  const [selectedCopy, setSelectedCopy] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(true);

  const handleSave = () => {
    if (onSave && (selectedCopy !== null || selectedImage !== null)) {
      const copy = selectedCopy !== null ? results.copy_variations[selectedCopy] : null;
      const image = selectedImage !== null ? results.image_prompts[selectedImage] : null;
      onSave(copy, image);
    }
  };

  React.useEffect(() => {
    // Auto-show modal on mount
    setShowGuidelinesModal(true);
  }, []);

  return (
    <div className="results-dashboard">
      <div className="results-header">
        <h2>Generated Campaign Content</h2>
        <div className="campaign-meta">
          <span className="meta-badge">{results.brief.industry}</span>
          <span className="meta-badge">{results.brief.platform}</span>
          <span className="meta-badge">{results.brief.objective}</span>
          <button 
            className="guidelines-button"
            onClick={() => setShowGuidelinesModal(true)}
            title="View Guidelines & Disclaimers"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '6px', verticalAlign: 'middle'}}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Guidelines
          </button>
        </div>
      </div>

      {showGuidelinesModal && (
        <div className="modal-overlay" onClick={() => setShowGuidelinesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Industry Guidelines & Disclaimers</h3>
              <button 
                className="modal-close"
                onClick={() => setShowGuidelinesModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {results.disclaimers && results.disclaimers.length > 0 && (
                <div className="modal-section disclaimers-section">
                  <h4>⚠️ Important Disclaimers</h4>
                  <ul>
                    {results.disclaimers.map((disclaimer, index) => (
                      <li key={index}>{disclaimer}</li>
                    ))}
                  </ul>
                </div>
              )}

              {results.industry_notes && (
                <div className="modal-section industry-notes">
                  <h4>Industry Guidelines</h4>
                  <p><strong>Tone:</strong> {results.industry_notes.tone}</p>
                  {results.industry_notes.restrictions && results.industry_notes.restrictions.length > 0 && (
                    <div className="restrictions">
                      <strong>Key Restrictions:</strong>
                      <ul>
                        {results.industry_notes.restrictions.map((restriction, index) => (
                          <li key={index}>{restriction}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="results-content-wrapper">
        <div className="main-content">
      <div className="results-grid">
        <div className="results-section">
          <CopyVariations 
            variations={results.copy_variations}
            onSelect={setSelectedCopy}
            selectedIndex={selectedCopy}
          />
        </div>

        <div className="results-section">
          <ImageSuggestions 
            prompts={results.image_prompts}
            platform={results.brief.platform}
            onSelect={setSelectedImage}
            selectedIndex={selectedImage}
          />
        </div>
      </div>

      {(selectedCopy !== null || selectedImage !== null) && (
        <PlatformPreview
          copy={selectedCopy !== null ? results.copy_variations[selectedCopy] : null}
          image={selectedImage !== null ? results.image_prompts[selectedImage] : null}
          platform={results.brief.platform}
          industry={results.brief.industry}
          disclaimers={results.disclaimers}
          onSave={handleSave}
        />
      )}
        </div>
      </div>
    </div>
  );
}

export default ResultsDashboard;
