from ai.adapters.base import ModelAdapter
from ai.contracts.model_contract import StandardModelResult


class DemoEvidenceVerificationAdapter(ModelAdapter):
    def run(self, payload: dict) -> StandardModelResult:
        found = payload.get("found", [])
        required = payload.get("required", [])
        missing = [item for item in required if item not in found]
        return StandardModelResult(model_name="Demo evidence verifier", model_version="demo-evidence-1.2.0", preprocessing_version="demo-doc-prep-1.0.0", prediction="EVIDENCE_COMPLETE" if not missing else "EVIDENCE_GAP", score=1 - len(missing) / max(len(required), 1), confidence=.94, status="SUCCESS", explanation="Required evidence was checked against the configured control requirement.", metadata={"missing": missing, "found": found})
