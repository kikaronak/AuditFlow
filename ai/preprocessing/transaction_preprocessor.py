from typing import Any

CANONICAL_FIELDS = ("transaction_id", "timestamp", "amount", "currency", "account", "vendor", "department", "category")


def map_to_canonical(source: dict[str, Any], mapping: dict[str, str]) -> dict[str, Any]:
    # Map organisation-specific fields to the canonical transaction schema.
    return {field: source.get(mapping.get(field, field)) for field in CANONICAL_FIELDS}


def prepare_for_model(transaction: dict[str, Any]) -> dict[str, Any]:
    # Replace this with the company's preprocessing pipeline.
    return transaction
