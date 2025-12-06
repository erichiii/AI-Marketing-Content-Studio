import json
from openai import OpenAI
from config.prompts import get_copy_generation_prompt, get_image_prompt_generation

class ContentGenerator:
    def __init__(self, api_key):
        self.client = OpenAI(api_key=api_key)
    
    def generate_copy_variations(self, brief):
        """Generate copy variations using LLM."""
        try:
            prompt = get_copy_generation_prompt(brief)
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",  # Faster and cheaper than gpt-4-turbo-preview
                messages=[
                    {"role": "system", "content": "You are an expert marketing copywriter who generates platform-optimized, industry-appropriate content."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                response_format={"type": "json_object"}
            )
            
            content = json.loads(response.choices[0].message.content)
            return content.get('variations', [])
        
        except Exception as e:
            error_msg = f"Error generating copy: {e}"
            print(error_msg)
            with open('error_log.txt', 'a') as f:
                f.write(f"{error_msg}\n")
            return []
    
    def generate_image_prompts(self, brief):
        """Generate detailed image prompts."""
        try:
            prompt = get_image_prompt_generation(brief)
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",  # Faster and cheaper than gpt-4-turbo-preview
                messages=[
                    {"role": "system", "content": "You are an expert creative director who creates detailed image generation prompts."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                response_format={"type": "json_object"}
            )
            
            content = json.loads(response.choices[0].message.content)
            return content.get('image_prompts', [])
        
        except Exception as e:
            error_msg = f"Error generating image prompts: {e}"
            print(error_msg)
            with open('error_log.txt', 'a') as f:
                f.write(f"{error_msg}\n")
            return []
    
    def generate_image(self, prompt_text, size="1024x1024"):
        """Generate an actual image using DALL-E."""
        try:
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=prompt_text,
                size=size,
                quality="standard",
                n=1,
            )
            
            return response.data[0].url
        
        except Exception as e:
            print(f"Error generating image: {e}")
            return None
