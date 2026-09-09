from ai.adapters.base import ModelAdapter
from ai.contracts.model_contract import StandardModelResult


class RuleBasedConclusionAdapter(ModelAdapter):
    def run(self, payload: dict) -> StandardModelResult:
        control = payload["control"]
        anomaly = payload["anomaly"]
        text = f"High-risk review required. The transaction scored {anomaly.score:.0%} on the anomaly model and the control was classified as {control.prediction}. Reviewer confirmation is required before final closure."
        return StandardModelResult(model_name="Demo conclusion composer", model_version="demo-conclusion-1.0.0", preprocessing_version="n/a", prediction="REVIEW_REQUIRED", score=anomaly.score, confidence=.87, status="SUCCESS", explanation=text, metadata={})
