from typing import Dict, TypedDict
from schemas.status import Status

class StatusResponse(TypedDict):
    success: bool
    imageUrl: str | None
    error: str | None

# Status configuration mapping to GenerateImageResponse
STATUS_CONFIG: Dict[Status, StatusResponse] = {
    Status.SUCCESS: {
        "success": True,
        "imageUrl": None,  # Will be set from response_data.output[0]
        "error": None
    },
    Status.PROCESSING: {
        "success": False,
        "imageUrl": None,
        "error": "Image generation is still processing"
    },
    Status.ERROR: {
        "success": False,
        "imageUrl": None,
        "error": "Image generation failed"
    },
    Status.PENDING: {
        "success": False,
        "imageUrl": None,
        "error": "Image generation pending"
    },
    Status.COMPLETED: {
        "success": True,
        "imageUrl": None,  # Will be set from response_data.output[0]
        "error": None
    },
    Status.FAILED: {
        "success": False,
        "imageUrl": None,
        "error": "Image generation failed"
    }
}
