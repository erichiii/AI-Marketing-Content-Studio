from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

from config.industries import INDUSTRY_RULES
from config.platforms import PLATFORM_SPECS
from services.content_generator import ContentGenerator
from services.risk_analyzer import RiskAnalyzer

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize services
content_generator = ContentGenerator(os.getenv('OPENAI_API_KEY'))
risk_analyzer = RiskAnalyzer()

@app.route('/api/config', methods=['GET'])
def get_config():
    """Get available industries and platforms."""
    return jsonify({
        "industries": list(INDUSTRY_RULES.keys()),
        "platforms": list(PLATFORM_SPECS.keys()),
        "objectives": ["Awareness", "Consideration", "Conversion"]
    })

@app.route('/api/generate', methods=['POST'])
def generate_campaign():
    """Generate campaign content based on brief."""
    try:
        brief = request.json
        
        # Validate required fields
        required_fields = ['industry', 'platform', 'objective', 'audience', 'message']
        for field in required_fields:
            if field not in brief:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Get industry rules and platform specs
        industry_rules = INDUSTRY_RULES.get(brief['industry'], {})
        platform_specs = PLATFORM_SPECS.get(brief['platform'], {})
        
        # Prepare enhanced brief
        enhanced_brief = {
            **brief,
            'industry_rules': industry_rules,
            'platform_specs': platform_specs,
            'variation_count': 3  # Reduced from 5 to 3 for speed
        }
        
        # Generate content
        copy_variations = content_generator.generate_copy_variations(enhanced_brief)
        image_prompts = content_generator.generate_image_prompts(enhanced_brief)
        
        # Only generate actual images if explicitly requested (makes generation much faster)
        generate_images = brief.get('generate_images', False)
        
        if generate_images:
            # Map aspect ratios to DALL-E 3 compatible sizes
            def get_dalle_size(ratio):
                ratio_map = {
                    '1:1': '1024x1024',    # Square - Meta, Instagram, Google Ads
                    '4:5': '1024x1024',    # Portrait (closest match) - Instagram, Google Ads
                    '9:16': '1024x1792',   # Vertical - Instagram, TikTok
                    '1.91:1': '1792x1024', # Landscape - Google Ads, LinkedIn
                    '2:1': '1792x1024',    # Wide landscape - Email
                    '16:9': '1792x1024',   # Standard landscape
                }
                return ratio_map.get(ratio, '1024x1024')
            
            # Get platform's recommended ratio for consistent sizing
            recommended_ratio = platform_specs.get('recommended_ratio', '1:1')
            dalle_size = get_dalle_size(recommended_ratio)
            
            # Generate actual images for each prompt with consistent sizing
            for img_prompt in image_prompts:
                if 'prompt' in img_prompt:
                    # Use platform's recommended ratio for all images
                    img_prompt['ratio'] = recommended_ratio
                    image_url = content_generator.generate_image(img_prompt['prompt'], dalle_size)
                    img_prompt['image_url'] = image_url
        else:
            # Set recommended ratio without generating images
            recommended_ratio = platform_specs.get('recommended_ratio', '1:1')
            for img_prompt in image_prompts:
                img_prompt['ratio'] = recommended_ratio
        
        # Analyze each copy variation
        for variation in copy_variations:
            variation['performance_analysis'] = risk_analyzer.analyze_performance_potential(
                variation, industry_rules
            )
        
        # Prepare response
        response = {
            "brief": brief,
            "copy_variations": copy_variations,
            "image_prompts": image_prompts,
            "disclaimers": industry_rules.get('disclaimers', []),
            "platform_specs": platform_specs,
            "industry_notes": {
                "tone": industry_rules.get('tone', ''),
                "restrictions": industry_rules.get('restrictions', []),
                "risk_level": industry_rules.get('risk_level', 'medium')
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-image', methods=['POST'])
def generate_single_image():
    """Generate a single image on-demand."""
    try:
        data = request.json
        prompt = data.get('prompt')
        size = data.get('size', '1024x1024')
        
        if not prompt:
            return jsonify({"error": "Missing prompt"}), 400
        
        image_url = content_generator.generate_image(prompt, size)
        
        if image_url:
            return jsonify({"image_url": image_url})
        else:
            return jsonify({"error": "Failed to generate image"}), 500
    
    except Exception as e:
        print(f"Error generating image: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, port=port)
