from pathlib import Path
from fastapi import Depends, FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from backend.auth.demo_auth import current_user
from backend.schemas.case import ReviewerAction, CaseActionResponse
from backend.services.audit_engine import analyse_case
from backend.repositories.audit_repository import audit_repository

app = FastAPI(title="AuditFlow API", version="0.1.0")
ROOT = Path(__file__).resolve().parents[1]
app.mount("/app", StaticFiles(directory=ROOT / "frontend"), name="frontend")

@app.get("/api/health")
def health(): return {"status": "ok", "environment": "demo"}

@app.get("/api/dashboard")
def dashboard(user=Depends(current_user)):
    return {"organisation": "Northstar Finance Group", "metrics": [{"label":"Transactions reviewed","value":"128,426","change":"+8.4% this month","tone":"blue"}, {"label":"Open audit cases","value":"42","change":"6 assigned to you","tone":"purple"}, {"label":"High-risk cases","value":"11","change":"3 new today","tone":"red"}, {"label":"Failed controls","value":"18","change":"4 require follow-up","tone":"amber"}, {"label":"Evidence gaps","value":"27","change":"Across 16 cases","tone":"amber"}, {"label":"Review required","value":"14","change":"Awaiting decision","tone":"purple"}]}

@app.get("/api/cases/{case_id}")
def get_case(case_id: str, user=Depends(current_user)):
    if case_id != "AC-2026-004182": raise HTTPException(404, "Case not found")
    case = analyse_case()
    case["audit_trail"] = audit_repository.get_events(case_id) + case["audit_trail"]
    return case

@app.post("/api/cases/{case_id}/decision", response_model=CaseActionResponse)
def reviewer_decision(case_id: str, action: ReviewerAction, user=Depends(current_user)):
    if user["role"] == "Read Only": raise HTTPException(403, "Read Only users cannot record decisions")
    audit_repository.append_event(case_id, user["id"], "Reviewer decision recorded", "REVIEW_REQUIRED", action.decision, action.note)
    return CaseActionResponse(case_id=case_id, status=action.decision, message="Decision recorded in the audit trail.")

@app.get("/")
def root():
    from fastapi.responses import FileResponse
    return FileResponse(ROOT / "frontend" / "index.html")
