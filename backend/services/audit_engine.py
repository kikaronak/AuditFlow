from ai.adapters.transaction_anomaly_adapter import DemoTransactionAnomalyAdapter
from ai.adapters.evidence_verification_adapter import DemoEvidenceVerificationAdapter
from ai.adapters.control_classifier_adapter import DemoControlClassifierAdapter
from ai.adapters.audit_conclusion_adapter import RuleBasedConclusionAdapter
from backend.services.model_execution import run_safely


def analyse_case() -> dict:
    transaction = {"transaction_id": "TXN-2026-004182", "amount": 148500, "currency": "USD", "vendor": "Orion Strategic Supplies", "department": "Operations", "account": "6100 · Professional services", "timestamp": "2026-09-08"}
    evidence = {"required": ["Invoice", "Purchase Order", "Approval - Level 1", "Approval - Level 2", "Bank Confirmation"], "found": ["Invoice", "Purchase Order", "Approval - Level 1", "Bank Confirmation"]}
    anomaly = run_safely(DemoTransactionAnomalyAdapter(), transaction, "transaction anomaly model")
    evidence_result = run_safely(DemoEvidenceVerificationAdapter(), evidence, "evidence verification model")
    control = run_safely(DemoControlClassifierAdapter(), {"missing": evidence_result.metadata.get("missing", [])}, "control classification model")
    conclusion = run_safely(RuleBasedConclusionAdapter(), {"anomaly": anomaly, "control": control}, "audit conclusion model")
    return {"case_id": "AC-2026-004182", "transaction": transaction, "anomaly": anomaly.model_dump(mode="json"), "evidence": evidence_result.model_dump(mode="json"), "control": control.model_dump(mode="json"), "conclusion": conclusion.model_dump(mode="json"), "audit_trail": [{"time": "09 Sep, 09:42", "actor": "AuditFlow AI", "action": "Control classification completed", "detail": "MISSING_APPROVAL"}, {"time": "09 Sep, 09:42", "actor": "AuditFlow AI", "action": "Evidence verification completed", "detail": "1 evidence item missing"}, {"time": "09 Sep, 09:41", "actor": "System", "action": "Case created", "detail": "Risk-based monitoring"}]}
