# AuditFlow — AI Audit & Control Verification

AuditFlow is a configurable, AI-assisted financial audit and compliance platform. The included interactive demo uses synthetic transactions and deterministic adapters to demonstrate the workflow, including navigation, investigation, reviewer decisions, controls, evidence, model registry and reporting screens. Production organisations connect their own preprocessing and models through `ai/` and `config/`.

## Run the demo

1. Create a virtual environment and install `pip install -r requirements.txt`.
2. Copy `.env.example` to `.env` and set real values for any non-demo deployment.
3. Run `uvicorn backend.main:app --reload`.
4. Open `http://127.0.0.1:8000`.

The demo account and case data are deliberately simulated. Case creation and report-generation flows demonstrate the user journey; production deployments must replace the demo repository, authentication and document-storage placeholders with approved organisation services.

See [the project and finance guide](docs/project-and-finance-guide.md) and [implementation guide](docs/implementation-guide.md).
