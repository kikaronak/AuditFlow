from datetime import datetime, timezone
from typing import Any, Literal
from pydantic import BaseModel, Field


class StandardModelResult(BaseModel):
    """The only result shape consumed by the audit engine and UI."""
    model_name: str
    model_version: str
    preprocessing_version: str
    prediction: str
    score: float | None = Field(default=None, ge=0, le=1)
    confidence: float | None = Field(default=None, ge=0, le=1)
    status: Literal["SUCCESS", "REVIEW_REQUIRED", "FAILED"]
    explanation: str
    execution_timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: dict[str, Any] = Field(default_factory=dict)
