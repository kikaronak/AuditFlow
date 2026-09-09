from fastapi import Header, HTTPException


def current_user(x_demo_role: str = Header(default="Auditor")) -> dict:
    allowed = {"Administrator", "Auditor", "Compliance Officer", "Finance Reviewer", "Read Only"}
    if x_demo_role not in allowed:
        raise HTTPException(403, "Unknown role")
    return {"id": "demo.auditor", "role": x_demo_role, "organisation_id": "demo-finance"}
