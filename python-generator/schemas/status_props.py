from typing import TypedDict, Optional

class StatusProps(TypedDict):
    label: str
    color: str
    is_final: bool
    success: bool
    should_return_image: bool
    message: str
    should_poll: Optional[bool]
