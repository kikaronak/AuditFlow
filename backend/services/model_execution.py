from ai.contracts.model_contract import StandardModelResult


def run_safely(adapter, payload: dict, module_name: str) -> StandardModelResult:
    """Convert integration failures into review-required outcomes."""
    try:
        result = adapter.run(payload)
        if not isinstance(result, StandardModelResult):
            raise ValueError("Adapter did not return StandardModelResult")
        if result.confidence is not None and result.confidence < .5:
            result.status = "REVIEW_REQUIRED"
            result.explanation = f"Low confidence from {module_name}; human review is required. {result.explanation}"
        return result
    except TimeoutError:
        reason = f"{module_name} timed out. The case requires human review."
    except (ValueError, TypeError, KeyError) as error:
        reason = f"{module_name} returned invalid input or output: {error}. The case requires human review."
    except Exception:
        reason = f"{module_name} is unavailable. The case requires human review."
    return StandardModelResult(model_name=module_name, model_version="unavailable", preprocessing_version="unavailable", prediction="REVIEW_REQUIRED", score=None, confidence=None, status="REVIEW_REQUIRED", explanation=reason, metadata={"failure_module": module_name})
