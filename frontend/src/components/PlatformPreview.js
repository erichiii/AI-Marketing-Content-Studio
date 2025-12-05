import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlatformPreview.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function PlatformPreview({ copy, image, platform, industry, disclaimers, onSave }) {
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState(null);

  // Define industry-specific disclaimers
  const getIndustryDisclaimer = () => {
    if (!industry) return null;
    
    const disclaimerMap = {
      'Healthcare': 'This content is for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional. Requires compliance review before publishing.',
      'Finance': 'This content is for informational purposes only and does not constitute financial advice. Past performance does not guarantee future results. Consult a licensed financial advisor. Requires compliance review before publishing.',
      'E-commerce': 'Results may vary. Offers subject to availability and terms. Always read product details carefully.',
      'SaaS': 'Results shown are illustrative examples. Individual results may vary based on usage and implementation.',
      'Education': 'Results may vary based on individual circumstances and effort. No guaranteed outcomes.'
    };
    
    return disclaimerMap[industry];
  };
  
  // Check if industry requires compliance review
  const requiresComplianceReview = () => {
    return ['Healthcare', 'Finance'].includes(industry);
  };

  useEffect(() => {
    // Auto-generate image when a new image is selected and it doesn't have an image_url
    if (image && image.prompt && !image.image_url && image.prompt !== lastGeneratedPrompt) {
      handleGenerateImage();
    }
    // Reset generated URL if image changes
    if (image && image.image_url) {
      setGeneratedImageUrl(image.image_url);
      setLastGeneratedPrompt(image.prompt);
    }
  }, [image]);

  if (!copy && !image) {
    return null;
  }

  const handleSave = () => {
    if (onSave) {
      onSave();
      alert('Campaign saved successfully!');
    }
  };

  const handleGenerateImage = async () => {
    if (!image || !image.prompt) return;
    
    setGeneratingImage(true);
    try {
      // Determine size based on ratio
      let size = "1024x1024";
      if (image.ratio === '16:9' || image.ratio === '1.91:1' || image.ratio === '2:1') {
        size = "1792x1024";
      } else if (image.ratio === '9:16') {
        size = "1024x1792";
      }

      const response = await axios.post(`${API_URL}/api/generate-image`, {
        prompt: image.prompt,
        size: size
      });
      
      if (response.data.image_url) {
        setGeneratedImageUrl(response.data.image_url);
        setLastGeneratedPrompt(image.prompt);
        // Update the original image object
        image.image_url = response.data.image_url;
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <div className="platform-preview">
      <div className="preview-header-row">
        <div>
          <h3>Platform Preview</h3>
          <p className="preview-description">
            Preview how your selected content will look on {platform}
          </p>
        </div>
        <button onClick={handleSave} className="save-campaign-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px', verticalAlign: 'middle'}}>
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save Campaign
        </button>
      </div>

      <div className="preview-container">
        <div className={`preview-card ${platform.toLowerCase().replace(/\s+/g, '-')}`}>
          <div className="preview-header">
            <div className="platform-icon">📱</div>
            <div className="platform-name">{platform} Ad Preview</div>
          </div>

          {image && (
            <div className="preview-image-container">
              {generatedImageUrl || image.image_url ? (
                <img 
                  src={generatedImageUrl || image.image_url} 
                  alt={`${platform} ad visual`}
                  className="preview-generated-image"
                />
              ) : generatingImage ? (
                <div className="preview-image-placeholder generating">
                  <div className="image-generating-spinner"></div>
                  <p className="generating-text">Generating image...</p>
                  <p className="generating-subtext">This may take 15-30 seconds</p>
                </div>
              ) : (
                <div className="preview-image-placeholder">
                  <div className="image-ratio-info">{image.ratio}</div>
                  <div className="image-prompt-preview">
                    <p><strong>Style:</strong> {image.style}</p>
                    <p><strong>Mood:</strong> {image.mood}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {copy && (
            <div className="preview-content">
              {copy.headline && (
                <div className="preview-headline">{copy.headline}</div>
              )}
              
              {copy.primary_text && (
                <div className="preview-body">{copy.primary_text}</div>
              )}
              
              {copy.cta && (
                <button className="preview-cta">{copy.cta}</button>
              )}
            </div>
          )}

          <div className="preview-footer">
            <small>This is a simplified preview. Actual appearance may vary.</small>
          </div>
        </div>

        {copy && (copy.performance_analysis || getIndustryDisclaimer() || requiresComplianceReview()) && (
          <div className="preview-insights">
            {copy.performance_analysis && (
              <>
                <h4>Performance Insights</h4>
                <div className="insight-item">
                  <span className="insight-label">Assessment:</span>
                  <span className={`insight-value ${copy.performance_analysis.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    {copy.performance_analysis.label}
                  </span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Details:</span>
                  <span className="insight-value">{copy.performance_analysis.details}</span>
                </div>
              </>
            )}
            {getIndustryDisclaimer() && (
              <div className="insights-disclaimer">
                <strong>Important Disclaimer:</strong> {getIndustryDisclaimer()}
              </div>
            )}
            {((copy.performance_analysis && copy.performance_analysis.requires_review) || requiresComplianceReview()) && (
              <div className="review-warning">
                ⚠️ Compliance review required before publishing - This content must be reviewed by your legal/compliance team
              </div>
            )}
          </div>
        )}
        {!copy && image && (
          <div className="preview-insights">
            {requiresComplianceReview() && (
              <div className="review-warning">
                ⚠️ Compliance review required before publishing - This content must be reviewed by your legal/compliance team
              </div>
            )}
            {getIndustryDisclaimer() && (
              <div className="insights-disclaimer">
                <strong>Important Disclaimer:</strong> {getIndustryDisclaimer()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlatformPreview;
