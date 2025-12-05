import React, { useState } from 'react';
import './CampaignForm.css';

function CampaignForm({ config, onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    industry: '',
    platform: '',
    objective: '',
    audience: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '');
  };

  if (!config) {
    return <div className="loading">Loading configuration...</div>;
  }

  return (
    <div className="campaign-form-container">
      <div className="form-card">
        <h2>Campaign Brief</h2>
        <p className="form-description">
          Fill out your campaign details to generate optimized content
        </p>

        <form onSubmit={handleSubmit} className="campaign-form">
          <div className="form-group">
            <label htmlFor="industry">Industry / Content Category *</label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
            >
              <option value="">Select an industry...</option>
              {config.industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="platform">Platform Target *</label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              required
            >
              <option value="">Select a platform...</option>
              {config.platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="objective">Campaign Objective *</label>
            <select
              id="objective"
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              required
            >
              <option value="">Select an objective...</option>
              {config.objectives.map(objective => (
                <option key={objective} value={objective}>{objective}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="audience">Target Audience *</label>
            <input
              type="text"
              id="audience"
              name="audience"
              value={formData.audience}
              onChange={handleChange}
              placeholder="e.g., Women 25-45, health-conscious, active lifestyle"
              required
            />
            <small>Age range, interests, demographics, etc.</small>
          </div>

          <div className="form-group">
            <label htmlFor="message">Key Message / Angle *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="e.g., Affordable mental health support without the stigma"
              rows="4"
              required
            />
            <small>The core promise or hook for your campaign</small>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={!isFormValid() || loading}
          >
            {loading ? (
              <span className="loading-text">
                <span className="spinner"></span>
                Generating Content... (This may take 15-30 seconds)
              </span>
            ) : 'Generate Campaign Content'}
          </button>
          
          {loading && (
            <div className="loading-info">
              <p>✨ Creating your campaign content...</p>
              <p>🖊️ Generating copy variations...</p>
              <p>🎨 Preparing image prompts...</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CampaignForm;
