from pydantic import BaseModel
from typing import Optional

class GenerateTextRequest(BaseModel):
    prompt: str

class GenerateTextResponse(BaseModel):
    success: bool
    text: str
    error: Optional[str] = None

class GenerateImageRequest(BaseModel):
    prompt: str
    negative_prompt: Optional[str] = None
    width: Optional[int] = 512
    height: Optional[int] = 512
    samples: Optional[int] = 1
    safety_checker: Optional[bool] = True
    seed: Optional[int] = None
    base64: Optional[bool] = False
    enhance_prompt: Optional[bool] = False
    track_id: Optional[str] = None
    webhook: Optional[str] = None

class GenerateImageResponse(BaseModel):
    success: bool
    imageUrl: Optional[str] = None
    error: Optional[str] = None
