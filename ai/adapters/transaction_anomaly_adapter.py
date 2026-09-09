from ai.adapters.base import ModelAdapter
from ai.contracts.model_contract import StandardModelResult


class DemoTransactionAnomalyAdapter(ModelAdapter):
    def run(self, payload: dict) -> StandardModelResult:
        # Connect the organisation's trained model or inference endpoint here.
        amount = float(payload.get("amount", 0))
        score = 0.91 if amount >= 100000 else 0.67 if amount >= 25000 else 0.19
        label = "HIGH_RISK_REVIEW" if score >= .8 else "UNUSUAL_PATTERN" if score >= .5 else "NORMAL_PATTERN"
        return StandardModelResult(model_name="Demo transaction anomaly", model_version="demo-anomaly-1.4.0", preprocessing_version="demo-txn-prep-1.1.0", prediction=label, score=score, confidence=.88, status="SUCCESS", explanation="Transaction value and approval pattern differ from the configured peer group.", metadata={"signals": ["amount_vs_peer_group", "approval_sequence"]})
