from typing import Literal
from pydantic import BaseModel, Field


class ReviewerAction(BaseModel):
    decision: Literal["PASS", "FAIL", "REVIEW_REQUIRED"]
    note: str = Field(min_length=1, max_length=2000)


class CaseActionResponse(BaseModel):
    case_id: str
    status: str
    message: str
