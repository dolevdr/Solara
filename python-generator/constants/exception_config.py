from typing import Dict, TypedDict
from schemas.exceptions import ExceptionType

class ExceptionResponse(TypedDict):
    success: bool
    imageUrl: str | None
    error: str

# Exception configuration mapping to GenerateImageResponse
EXCEPTION_CONFIG: Dict[ExceptionType, ExceptionResponse] = {
    ExceptionType.TIMEOUT: {
        "success": False,
        "imageUrl": None,
        "error": "Request timeout - image generation took too long"
    },
    ExceptionType.REQUEST_FAILED: {
        "success": False,
        "imageUrl": None,
        "error": "Request failed"
    },
    ExceptionType.UNEXPECTED_ERROR: {
        "success": False,
        "imageUrl": None,
        "error": "Unexpected error occurred"
    },
    ExceptionType.API_KEY_NOT_CONFIGURED: {
        "success": False,
        "imageUrl": None,
        "error": "STABLE_DIFFUSION_KEY not configured"
    },
    ExceptionType.INVALID_API_KEY: {
        "success": False,
        "imageUrl": None,
        "error": "Invalid API Key. Get API key from: https://modelslab.com/dashboard/api-keys"
    }
}
