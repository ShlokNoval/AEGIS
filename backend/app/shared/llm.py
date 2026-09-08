import os
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

_gemini_client_initialized = False

def get_api_key() -> Optional[str]:
    """Retrieve Gemini or Vertex API key from environment."""
    return (
        os.getenv("GEMINI_API_KEY") or 
        os.getenv("GOOGLE_API_KEY") or 
        os.getenv("VERTEX_API_KEY")
    )

def init_gemini() -> bool:
    global _gemini_client_initialized
    if _gemini_client_initialized:
        return True
    
    api_key = get_api_key()
    if api_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            _gemini_client_initialized = True
            logger.info("Google Generative AI client initialized successfully.")
            return True
        except Exception as e:
            logger.warning(f"Could not configure google.generativeai: {e}")
            return False
    return False

async def generate_text(
    prompt: str,
    model_name: str = "gemini-1.5-flash",
    temperature: float = 0.2,
    system_instruction: Optional[str] = None
) -> Optional[str]:
    """
    Generates text using Google Gemini API if configured.
    Returns None if no API key is set or on error, allowing callers to fall back to heuristic synthesis.
    """
    if not init_gemini():
        return None

    try:
        import google.generativeai as genai
        target_model = "gemini-pro-latest" if "pro" in model_name.lower() else "gemini-flash-latest"
        
        kwargs: Dict[str, Any] = {
            "model_name": target_model,
            "generation_config": {
                "temperature": temperature,
                "top_p": 0.95,
                "max_output_tokens": 2048,
            }
        }
        if system_instruction:
            kwargs["system_instruction"] = system_instruction
            
        model = genai.GenerativeModel(**kwargs)
        response = model.generate_content(prompt)
        if response and hasattr(response, "text") and response.text:
            return response.text.strip()
    except Exception as e:
        logger.warning(f"Gemini generation call failed ({e}). Reverting to analytical heuristic reasoning.")
    
    return None
