import os
from typing import Optional

class APIConfig:
    """Configuration class for API settings"""
    
    def __init__(self):
        self.stable_diffusion_key: str = os.getenv("STABLE_DIFFUSION_KEY", "")
        self.modelslab_api_url: str = os.getenv("MODELSLAB_API_URL", "")
        self.webhook_base_url: str = os.getenv("WEBHOOK_BASE_URL", "http://localhost:3000")
        self.gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
        
        # Gemini model configuration
        self.gemini_model: str = "gemini-2.0-flash-exp"
        self.gemini_max_tokens: Optional[int] = None
        self.gemini_temperature: float = 0.7
        
        # Stable Diffusion configuration
        self.default_width: int = 512
        self.default_height: int = 512
        self.default_samples: int = 1
        self.default_safety_checker: bool = True
        self.default_negative_prompt: str = "bad quality, blurry, distorted"
        
    @property
    def is_gemini_configured(self) -> bool:
        """Check if Gemini API is properly configured"""
        return bool(self.gemini_api_key)
    
    @property
    def is_stable_diffusion_configured(self) -> bool:
        """Check if Stable Diffusion API is properly configured"""
        return bool(self.stable_diffusion_key and self.modelslab_api_url)
    
    def get_gemini_config(self) -> dict:
        """Get Gemini API configuration"""
        return {
            "api_key": self.gemini_api_key,
            "model": self.gemini_model,
            "max_tokens": self.gemini_max_tokens,
            "temperature": self.gemini_temperature
        }
    
    def get_stable_diffusion_config(self) -> dict:
        """Get Stable Diffusion API configuration"""
        return {
            "api_key": self.stable_diffusion_key,
            "api_url": self.modelslab_api_url,
            "webhook_url": self.webhook_base_url,
            "default_width": self.default_width,
            "default_height": self.default_height,
            "default_samples": self.default_samples,
            "default_safety_checker": self.default_safety_checker,
            "default_negative_prompt": self.default_negative_prompt
        }

# Global config instance
api_config = APIConfig()
