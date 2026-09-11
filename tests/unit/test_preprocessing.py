from ai.preprocessing.transaction_preprocessor import map_to_canonical


def test_field_mapping_keeps_source_names_out_of_core_schema():
    source = {"txn_no": "A-1", "transaction_value": 25, "supplier_code": "V-9"}
    mapped = map_to_canonical(source, {"transaction_id": "txn_no", "amount": "transaction_value", "vendor": "supplier_code"})
    assert mapped["transaction_id"] == "A-1"
    assert mapped["amount"] == 25
    assert mapped["vendor"] == "V-9"
