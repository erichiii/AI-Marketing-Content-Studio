import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CampaignForm from './components/CampaignForm';
import ResultsDashboard from './components/ResultsDashboard';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showSavedCampaigns, setShowSavedCampaigns] = useState(false);
  const [savedCampaigns, setSavedCampaigns] = useState([]);

  // Load saved campaigns from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedCampaigns');
    if (saved) {
      setSavedCampaigns(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Fetch configuration on mount
    axios.get(`${API_URL}/api/config`)
      .then(response => setConfig(response.data))
      .catch(err => console.error('Error fetching config:', err));
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleSubmit = async (brief) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post(`${API_URL}/api/generate`, brief);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <nav className="header-nav">
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="nav-button nav-button-icon"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={handleReset} className="nav-button">
            New Campaign
          </button>
          <button 
            onClick={() => setShowSavedCampaigns(!showSavedCampaigns)} 
            className="nav-button nav-button-secondary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px', verticalAlign: 'middle'}}>
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            {showSavedCampaigns ? 'Close' : `Saved (${savedCampaigns.length})`}
          </button>
        </nav>
        <div className="header-content">
          <h1>AI Marketing Content Studio</h1>
          <p>Transform your campaign brief into platform-ready assets</p>
        </div>
      </header>

      <main className="app-main">
        {showSavedCampaigns ? (
          <div className="saved-campaigns-view">
            <h2>Saved Campaigns</h2>
            {savedCampaigns.length === 0 ? (
              <p className="empty-state">No saved campaigns yet. Generate and save your first campaign!</p>
            ) : (
              <div className="saved-campaigns-grid">
                {savedCampaigns.map((campaign, index) => (
                  <div key={index} className="saved-campaign-card">
                    <div className="saved-campaign-header">
                      <h3>{campaign.brief.industry} - {campaign.brief.platform}</h3>
                      <button 
                        onClick={() => {
                          const updated = savedCampaigns.filter((_, i) => i !== index);
                          setSavedCampaigns(updated);
                          localStorage.setItem('savedCampaigns', JSON.stringify(updated));
                        }}
                        className="delete-btn"
                        title="Delete campaign"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                    <p className="saved-date">{new Date(campaign.savedAt).toLocaleDateString()}</p>
                    <div className="saved-meta">
                      <span className="meta-badge">{campaign.brief.objective}</span>
                    </div>
                    {campaign.selectedCopy && (
                      <div className="saved-copy">
                        <strong>Copy:</strong>
                        <p>{campaign.selectedCopy.headline || campaign.selectedCopy.primary_text}</p>
                      </div>
                    )}
                    {campaign.selectedImage && (
                      <div className="saved-image">
                        {campaign.selectedImage.image_url && (
                          <img src={campaign.selectedImage.image_url} alt="Campaign visual" />
                        )}
                      </div>
                    )}
                    <button 
                      onClick={() => {
                        setResults(campaign);
                        setShowSavedCampaigns(false);
                      }}
                      className="load-btn"
                    >
                      Load Campaign
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !results ? (
          <CampaignForm 
            config={config} 
            onSubmit={handleSubmit} 
            loading={loading}
            error={error}
          />
        ) : (
          <ResultsDashboard 
            results={results} 
            onReset={handleReset}
            onSave={(selectedCopy, selectedImage) => {
              const campaignToSave = {
                ...results,
                selectedCopy,
                selectedImage,
                savedAt: new Date().toISOString()
              };
              const updated = [...savedCampaigns, campaignToSave];
              setSavedCampaigns(updated);
              localStorage.setItem('savedCampaigns', JSON.stringify(updated));
            }}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 AI Marketing Content Studio</p>
      </footer>
    </div>
  );
}

export default App;
