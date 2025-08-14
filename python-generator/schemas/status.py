from enum import Enum

class Status(str, Enum):
    SUCCESS = "success"
    PROCESSING = "processing"
    ERROR = "error"
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
