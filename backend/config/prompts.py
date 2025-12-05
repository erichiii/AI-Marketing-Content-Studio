def get_copy_generation_prompt(brief):
    """Generate prompt for copy variations based on campaign brief."""
    industry_rules = brief.get('industry_rules', {})
    platform_specs = brief.get('platform_specs', {})
    
    return f"""You are an expert marketing copywriter. Generate {brief.get('variation_count', 5)} unique copy variations for a {brief['platform']} campaign.

Campaign Brief:
- Industry: {brief['industry']}
- Platform: {brief['platform']}
- Objective: {brief['objective']}
- Target Audience: {brief['audience']}
- Key Message: {brief['message']}

Industry Guidelines:
- Tone: {industry_rules.get('tone', 'professional and engaging')}
- Restrictions: {', '.join(industry_rules.get('restrictions', []))}

Platform Constraints:
- Headline max: {platform_specs.get('headline_max', 'no limit')} characters
- Primary text max: {platform_specs.get('primary_text_max', 'no limit')} characters
- Format notes: {platform_specs.get('format_notes', 'standard format')}

Generate variations in the following JSON format:
{{
  "variations": [
    {{
      "headline": "compelling headline",
      "primary_text": "engaging primary text",
      "cta": "clear call to action",
      "notes": "any special considerations"
    }}
  ]
}}

Each variation should:
1. Follow industry tone and restrictions
2. Respect platform character limits
3. Be distinct from other variations
4. Include a strong, clear CTA
5. Target the specified audience and objective"""

def get_image_prompt_generation(brief):
    """Generate prompt for image suggestions."""
    return f"""You are an expert creative director. Generate {brief.get('variation_count', 5)} detailed image prompts for a {brief['platform']} campaign.

Campaign Brief:
- Industry: {brief['industry']}
- Platform: {brief['platform']}
- Objective: {brief['objective']}
- Target Audience: {brief['audience']}
- Key Message: {brief['message']}

Platform Image Specs:
- Recommended ratio: {brief.get('platform_specs', {}).get('recommended_ratio', '1:1')}
- Available ratios: {brief.get('platform_specs', {}).get('image_ratios', ['1:1'])}

Generate image prompts in the following JSON format:
{{
  "image_prompts": [
    {{
      "prompt": "detailed image generation prompt",
      "ratio": "recommended aspect ratio",
      "style": "visual style description",
      "elements": ["key visual elements"],
      "mood": "emotional tone of the image"
    }}
  ]
}}

Each prompt should:
1. Be specific and actionable for image generation
2. Align with industry appropriateness
3. Match the platform's visual style
4. Support the key message
5. Appeal to the target audience"""
