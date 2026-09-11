import pytest
from ai.adapters.transaction_anomaly_adapter import DemoTransactionAnomalyAdapter
from ai.adapters.evidence_verification_adapter import DemoEvidenceVerificationAdapter
from ai.adapters.control_classifier_adapter import DemoControlClassifierAdapter
from ai.contracts.model_contract import StandardModelResult
from backend.services.model_execution import run_safely
from ai.adapters.base import ModelAdapter


def test_anomaly_adapter_returns_standard_contract():
    result = DemoTransactionAnomalyAdapter().run({"amount": 125000})
    assert isinstance(result, StandardModelResult)
    assert result.status == "SUCCESS"
    assert result.score >= .8


def test_missing_approval_is_not_pass():
    evidence = DemoEvidenceVerificationAdapter().run({"required": ["Approval - Level 2"], "found": []})
    result = DemoControlClassifierAdapter().run({"missing": evidence.metadata["missing"]})
    assert result.prediction == "MISSING_APPROVAL"
    assert result.prediction != "PASS"

def test_contract_rejects_invalid_score():
    with pytest.raises(Exception):
        StandardModelResult(model_name="bad", model_version="1", preprocessing_version="1", prediction="x", score=1.1, confidence=.5, status="SUCCESS", explanation="x")


class FailingAdapter(ModelAdapter):
    def run(self, payload): raise TimeoutError()


def test_timeout_never_becomes_pass():
    result = run_safely(FailingAdapter(), {}, "test model")
    assert result.status == "REVIEW_REQUIRED"
    assert result.prediction == "REVIEW_REQUIRED"


def test_invalid_transaction_data_requires_review():
    result = run_safely(DemoTransactionAnomalyAdapter(), {"amount": "not-a-number"}, "anomaly")
    assert result.status == "REVIEW_REQUIRED"
