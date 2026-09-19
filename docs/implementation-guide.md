# Implementation Guide

## Structure

`frontend/` contains the professional browser interface. `backend/` contains the API, services, schemas and demo authentication. `ai/contracts/` defines the stable result contract. `ai/preprocessing/` maps raw data and prepares it for models; `ai/adapters/` connects model-specific implementations. `config/` holds organisation, field mapping and model registry examples. `tests/` has API, preprocessing and contract tests.

## Install and run

Create a Python virtual environment, install `requirements.txt`, copy `.env.example` to `.env`, then run `uvicorn backend.main:app --reload`. Browse to `http://127.0.0.1:8000`. Run checks with `pytest`.

The interactive demo supports navigation across dashboard, case, transaction, control, evidence, model-registry and reporting screens. It also supports a demo create-case flow and reviewer actions. These are intentionally backed by synthetic data and the minimal demo API, so they can be explored before any model is connected.

## Database and authentication

The starter demo intentionally keeps audit events in memory for simple setup. Its create-case and report-generation UI flows are demonstrations, not persistent service integrations. Before production, add tenant-scoped repositories under `backend/repositories/` backed by the organisation’s approved database and job queue. Persist cases, evidence metadata, model executions, generated reports and append-only audit events; never replace historical audit events.

Replace `backend/auth/demo_auth.py` with OIDC/SAML or the organisation’s identity provider. Authorise every record query by both role and `organisation_id`. The five suggested roles are Administrator, Auditor, Compliance Officer, Finance Reviewer and Read Only. Keep document objects in protected storage and serve them only through access-checked, short-lived URLs.

## Organisation configuration

The normal integration files are:

- `config/organisation/demo.json` — organisation name, currency, enabled modules, risk thresholds and available classes.
- `config/field_mappings/demo.json` — maps source names to canonical platform fields without renaming the source dataset.
- `config/model_registry/demo.json` — maps each capability to an adapter and declares model/preprocessing versions.
- `ai/preprocessing/transaction_preprocessor.py` and `ai/preprocessing/document_preprocessor.py` — organisation-specific transformations.
- The four adapters in `ai/adapters/` — organisation inference connections.

The canonical transaction structure is `transaction_id`, `timestamp`, `amount`, `currency`, `account`, `vendor`, `department` and `category`. Add optional fields without changing the core contract. Validate input types and required values before preprocessing; insufficient input must create `REVIEW_REQUIRED`.

## Models and contracts

Every adapter implements `ModelAdapter.run(payload)` and returns `StandardModelResult` from `ai/contracts/model_contract.py`. Required fields are `model_name`, `model_version`, `preprocessing_version`, `prediction`, `status`, `explanation` and `execution_timestamp`; `score`, `confidence` and `metadata` are strongly recommended. Scores and confidence are constrained to 0–1. The UI and audit engine must only consume this contract.

Connect transaction models in `transaction_anomaly_adapter.py`, evidence/OCR/NLP/RAG models in `evidence_verification_adapter.py`, control models in `control_classifier_adapter.py`, and explanation models in `audit_conclusion_adapter.py`. Each is deliberately small: map the company’s input format, invoke the local model or endpoint, and convert its native result to `StandardModelResult`.

To use an external model API, load endpoint and credential values from environment variables in the backend, set explicit timeouts, validate the response before mapping it, and catch transport, timeout and schema errors. Return a standard result with `status="REVIEW_REQUIRED"`, a specific failure reason and diagnostic metadata. Do not put API keys in the frontend or configuration committed to source control.

Register every deployment by updating the relevant model registry entry and preserve the previous version. Store the registry values alongside every model result. Configure thresholds and label sets in the organisation file; do not hard-code labels in the UI.

## Adding or replacing a model

Create an adapter class inheriting `ModelAdapter`, put its preprocessing changes in the relevant preprocessor, write a contract test that calls it with valid and invalid inputs, update the model registry, then run integration tests. Replacing a model follows the same process: retain the old registry record for auditability, deploy the new adapter/version and validate it on approved test data.

## Demo mode and deployment

Demo mode uses synthetic values from `backend/services/audit_engine.py`; the deterministic adapters are examples only. It is not a production risk model. The interactive screens in `frontend/app.js` make the workflow explorable, but document previews/uploads, newly created cases and report output need real backend services before production. Deploy the API behind TLS, use a managed secret store, rate limit file/API endpoints, scan uploads, encrypt data at rest and in transit, restrict CORS, add structured logs and monitoring, and enforce retention policies. Run worker jobs for long document/model processing rather than blocking web requests.

## Troubleshooting

If the UI cannot load, confirm `/api/health` responds and that the backend is running from the project root. If an adapter fails, inspect its returned status and execution metadata rather than treating it as a pass. If source fields are missing, revise the field mapping first. If the model response is malformed, fix the adapter mapping and add a regression test before re-enabling it.
