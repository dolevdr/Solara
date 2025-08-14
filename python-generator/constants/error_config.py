# Error Configuration for Image Generation

ERROR_TYPES = {
    "INVALID_API_KEY": "Invalid API Key. Get API key from: https://modelslab.com/dashboard/api-keys",
    "TIMEOUT": "Request timeout - image generation took too long",
    "REQUEST_FAILED": "Request failed",
    "UNEXPECTED_ERROR": "Unexpected error occurred",
    "NO_IMAGE_GENERATED": "No image generated from API response",
    "API_KEY_NOT_CONFIGURED": "STABLE_DIFFUSION_KEY not configured",
    "PROCESSING_TIMEOUT": "Image generation is still processing after maximum wait time"
}

# Error mapping for different exception types
EXCEPTION_ERROR_MAPPING = {
    "requests.exceptions.Timeout": ERROR_TYPES["TIMEOUT"],
    "requests.exceptions.RequestException": ERROR_TYPES["REQUEST_FAILED"],
    "KeyError": ERROR_TYPES["UNEXPECTED_ERROR"],
    "ValueError": ERROR_TYPES["UNEXPECTED_ERROR"],
    "TypeError": ERROR_TYPES["UNEXPECTED_ERROR"]
}

# HTTP status codes for different error types
ERROR_STATUS_CODES = {
    "INVALID_API_KEY": 401,
    "TIMEOUT": 408,
    "REQUEST_FAILED": 500,
    "UNEXPECTED_ERROR": 500,
    "NO_IMAGE_GENERATED": 500,
    "API_KEY_NOT_CONFIGURED": 500,
    "PROCESSING_TIMEOUT": 408
}
