# AI Marketing Content Studio

An AI-powered marketing content studio that transforms campaign briefs into platform-ready assets (copy + visuals) with industry-specific compliance handling.

## 🎯 Features

- **Multi-Industry Support**: Healthcare, Finance, E-commerce, SaaS, Education
- **Platform Optimization**: Meta, Instagram, Google Ads, TikTok, LinkedIn, Email
- **Smart Copy Generation**: 5 unique variations per campaign with performance analysis
- **Image Prompts**: Detailed, ready-to-use prompts for image generation tools
- **Compliance & Disclaimers**: Automatic disclaimers for regulated industries
- **Risk Analysis**: Performance potential indicators (Safe & Clear, Aggressive/Risky, Low Clarity)
- **Platform Previews**: Visual preview of how content will appear on selected platforms

## 🏗️ Architecture

```
AI-Marketing-Content-Studio/
├── backend/                 # Flask API
│   ├── app.py              # Main Flask application
│   ├── config/             # Industry & platform configurations
│   │   ├── industries.py   # Industry-specific rules
│   │   ├── platforms.py    # Platform constraints
│   │   └── prompts.py      # LLM prompt templates
│   └── services/           # Business logic
│       ├── content_generator.py
│       └── risk_analyzer.py
└── frontend/               # React application
    └── src/
        ├── components/
        │   ├── CampaignForm.js
        │   ├── ResultsDashboard.js
        │   ├── CopyVariations.js
        │   ├── ImageSuggestions.js
        │   └── PlatformPreview.js
        └── App.js
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- OpenAI API key

### Backend Setup

1. **Navigate to backend directory**:
   ```powershell
   cd backend
   ```

2. **Create virtual environment**:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. **Install dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```

4. **Configure environment**:
   ```powershell
   Copy-Item .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   PORT=5000
   ```

5. **Run the backend**:
   ```powershell
   python app.py
   ```
   
   Backend will run at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory** (in new terminal):
   ```powershell
   cd frontend
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Start the development server**:
   ```powershell
   npm start
   ```
   
   Frontend will run at `http://localhost:3000`

## 📖 Usage

### Creating a Campaign

1. **Fill out the campaign brief**:
   - Select **Industry** (e.g., Healthcare, E-commerce)
   - Choose **Platform** (e.g., Meta, Instagram)
   - Pick **Objective** (Awareness, Consideration, Conversion)
   - Define **Target Audience** (demographics, interests)
   - Enter **Key Message** (your campaign hook)

2. **Generate Content**: Click "Generate Campaign Content"

3. **Review Results**:
   - **Copy Variations**: 5 unique options with performance analysis
   - **Image Prompts**: Detailed prompts for your design tools
   - **Disclaimers**: Auto-generated compliance notes
   - **Platform Preview**: See how content looks in-platform

4. **Export**: Click "Copy Text" or "Copy Prompt" to use content

### Example Scenarios

#### Healthcare Campaign (Meta)
```
Industry: Healthcare
Platform: Meta
Objective: Awareness
Audience: Women 25-45, health-conscious
Message: Affordable mental health support without stigma
```

**Output includes**:
- Professional, empowering copy variations
- Disclaimers: "Consult a healthcare professional..."
- Risk analysis for compliance
- 1:1 aspect ratio image prompts

#### E-commerce Campaign (Instagram)
```
Industry: E-commerce
Platform: Instagram
Objective: Conversion
Audience: Gen Z, fashion-forward, 18-25
Message: Sustainable fashion at accessible prices
```

**Output includes**:
- Engaging, action-oriented copy
- 4:5 aspect ratio for Instagram feed
- Bold, visual-first recommendations
- Clear CTAs

## 🔧 Configuration

### Adding New Industries

Edit `backend/config/industries.py`:

```python
"YourIndustry": {
    "tone": "your preferred tone",
    "disclaimers": ["Your disclaimers"],
    "restrictions": ["Your restrictions"],
    "risk_level": "high|medium|low"
}
```

### Adding New Platforms

Edit `backend/config/platforms.py`:

```python
"YourPlatform": {
    "headline_max": 50,
    "primary_text_max": 150,
    "image_ratios": ["1:1", "16:9"],
    "recommended_ratio": "1:1",
    "format_notes": "Your platform-specific notes"
}
```

## 🎨 Key Components

### Backend

- **ContentGenerator**: Generates copy and image prompts using OpenAI GPT-4
- **RiskAnalyzer**: Analyzes copy for compliance risks and clarity
- **Industry Rules**: Predefined guidelines for sensitive industries
- **Platform Specs**: Character limits and format requirements

### Frontend

- **CampaignForm**: Input form for campaign briefs
- **ResultsDashboard**: Main results view with disclaimers and guidelines
- **CopyVariations**: Displays generated copy with risk analysis
- **ImageSuggestions**: Shows image prompts with metadata
- **PlatformPreview**: Mock preview of platform appearance

## 📋 API Endpoints

### `GET /api/config`
Returns available industries, platforms, and objectives.

### `POST /api/generate`
Generates campaign content from brief.

**Request Body**:
```json
{
  "industry": "Healthcare",
  "platform": "Meta",
  "objective": "Awareness",
  "audience": "Women 25-45, health-conscious",
  "message": "Affordable mental health support"
}
```

**Response**:
```json
{
  "copy_variations": [...],
  "image_prompts": [...],
  "disclaimers": [...],
  "platform_specs": {...},
  "industry_notes": {...}
}
```

## 🔐 Compliance Features

- **Auto-disclaimers** for Healthcare, Finance, Education
- **Risk keyword detection** (e.g., "guarantee", "cure", "100%")
- **Performance potential scoring**
- **Compliance review flags** for high-risk content
- **Industry-specific restrictions** enforcement

## 🎯 Minimum Requirements Met

✅ Accepts all required campaign brief inputs  
✅ Generates content for multiple industries (including Healthcare)  
✅ Produces detailed, ready-to-use image prompts  
✅ Surfaces disclaimers for sensitive categories  
✅ Platform-specific character limits and formatting  
✅ Performance potential indicators  
✅ End-to-end demo scenarios supported  

## 🚀 Bonus Features Included

✅ Reusable prompt templates with variable injection  
✅ Platform preview modes with mock ad cards  
✅ Copy-to-clipboard functionality  
✅ Responsive design for mobile/tablet  
✅ Real-time form validation  
✅ Industry guidelines display  
✅ Risk analysis system  

## 🛠️ Tech Stack

- **Backend**: Python, Flask, OpenAI GPT-4
- **Frontend**: React, Axios, CSS3
- **APIs**: OpenAI Chat Completions

## 📝 Development Notes

- All LLM responses use structured JSON output
- Copy variations respect platform character limits
- Image prompts include aspect ratios and style guidance
- Risk analysis uses keyword detection + industry context
- Frontend uses environment variables for API configuration

## 🐛 Troubleshooting

**Backend won't start**:
- Check Python version: `python --version` (needs 3.8+)
- Verify OpenAI API key in `.env`
- Ensure virtual environment is activated

**Frontend won't start**:
- Check Node version: `node --version` (needs 16+)
- Delete `node_modules` and run `npm install` again
- Check if port 3000 is available

**API errors**:
- Verify OpenAI API key is valid
- Check API rate limits
- Review backend console for error messages

## 📄 License

This project is for demonstration purposes.

## 👥 Contributing

This is an MVP. Future enhancements could include:
- Content library with save/search functionality
- Real image generation (DALL-E integration)
- A/B testing recommendations
- Content calendar view
- Export to PDF/CSV
- Multi-language support
