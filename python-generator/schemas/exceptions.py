from enum import Enum

class ExceptionType(str, Enum):
    TIMEOUT = "timeout"
    REQUEST_FAILED = "request_failed"
    UNEXPECTED_ERROR = "unexpected_error"
    API_KEY_NOT_CONFIGURED = "api_key_not_configured"
    INVALID_API_KEY = "invalid_api_key"
