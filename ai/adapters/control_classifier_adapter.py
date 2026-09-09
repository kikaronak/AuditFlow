from ai.adapters.base import ModelAdapter
from ai.contracts.model_contract import StandardModelResult


class DemoControlClassifierAdapter(ModelAdapter):
    def run(self, payload: dict) -> StandardModelResult:
        missing = payload.get("missing", [])
        prediction = "MISSING_APPROVAL" if "Approval - Level 2" in missing else "MISSING_EVIDENCE" if missing else "PASS"
        return StandardModelResult(model_name="Demo control classifier", model_version="demo-control-2.0.0", preprocessing_version="demo-control-prep-1.0.0", prediction=prediction, score=.89 if prediction != "PASS" else .12, confidence=.91, status="SUCCESS", explanation="Control outcome is based on the mapped evidence requirement and configured approval rule.", metadata={})
