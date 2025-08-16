import warnings
warnings.filterwarnings("ignore", message="Field name.*shadows an attribute in parent.*")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import requests
from dotenv import load_dotenv
from google import genai
from schemas.models import GenerateTextRequest, GenerateTextResponse, GenerateImageRequest, GenerateImageResponse
from schemas.status import Status
from schemas.exceptions import ExceptionType
from constants.status_config import STATUS_CONFIG
from constants.exception_config import EXCEPTION_CONFIG

load_dotenv()

# Load configuration
STABLE_DIFFUSION_KEY = os.getenv("STABLE_DIFFUSION_KEY", "")
MODELSLAB_API_URL = os.getenv("MODELSLAB_API_URL", "")
WEBHOOK_BASE_URL = os.getenv("WEBHOOK_BASE_URL", "http://localhost:3000")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Initialize Gemini clien

app = FastAPI(title="AI Content Generator", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI Content Generator"}

@app.post("/generate-text", response_model=GenerateTextResponse)
async def generate_text(request: GenerateTextRequest):
    """
    Generate text using Google Gemini API
    """
    try:
        client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

        prompt = f"{request.prompt}. Answer should be in 50 words max"
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        
        return GenerateTextResponse(
            success=True,
            text=response.text
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-image", response_model=GenerateImageResponse)
async def generate_image(request: GenerateImageRequest):
    """
    Generate image using Modelslab Stable Diffusion API
    """
    try:
        if not STABLE_DIFFUSION_KEY:
            config = EXCEPTION_CONFIG[ExceptionType.API_KEY_NOT_CONFIGURED]
            raise HTTPException(status_code=500, detail=config["error"])


        
        # Prepare the request payload with webhook
        payload = {
            "key": STABLE_DIFFUSION_KEY,
            "prompt": request.prompt,
            "negative_prompt": request.negative_prompt or "bad quality, blurry, distorted",
            "width": str(request.width or 512),
            "height": str(request.height or 512),
            "samples": request.samples or 1,
            "safety_checker": request.safety_checker,
            "seed": request.seed,
            "instant_response": False,
            "base64": request.base64 or False,
            "webhook": WEBHOOK_BASE_URL,
            "track_id": request.track_id,
            "enhance_prompt": request.enhance_prompt or False
        }

        # Make request to Modelslab API
        headers = {'Content-Type': 'application/json'}
        response = requests.post(
            MODELSLAB_API_URL, 
            headers=headers, 
            json=payload, 
            timeout=60
        )
        response_data = response.json()

        print(f"Modelslab API Response: {response_data}")

        if response_data["status"] == "error":
            raise HTTPException(status_code=500, detail=response_data["message"])
        
        # Get status from response
        status = response_data.get("status")
        
        # Get config for this status
        config = STATUS_CONFIG[Status(status)]
        
        image_url = response_data["output"][0] if response_data.get("output") else None
        
        return GenerateImageResponse(
                success=config["success"] or False,
                imageUrl=image_url,
                error=config["error"]
            )


    except requests.exceptions.Timeout:
        config = EXCEPTION_CONFIG[ExceptionType.TIMEOUT]
        raise HTTPException(status_code=408, detail=config["error"])
    except requests.exceptions.RequestException as e:
        config = EXCEPTION_CONFIG[ExceptionType.REQUEST_FAILED]
        error_message = f"{config['error']}: {str(e)}"
        raise HTTPException(status_code=500, detail=error_message)
    except Exception as e:
        config = EXCEPTION_CONFIG[ExceptionType.UNEXPECTED_ERROR]
        error_message = f"{config['error']}: {str(e)}"
        raise HTTPException(status_code=500, detail=error_message)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
