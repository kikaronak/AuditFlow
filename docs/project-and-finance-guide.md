# Project & Finance Guide

## What AuditFlow does

AuditFlow helps a finance organisation continuously examine transactions, documents and internal controls. It turns the output of the organisation's own AI/ML models into an accountable workflow: a risk signal becomes an audit case, evidence is checked against a control, a person reviews the explanation, and every decision is recorded. It is an AI-assisted system, not an autonomous accounting, legal, or fraud decision maker.

It is useful because teams can focus on exceptions instead of manually screening every item. The platform deliberately says “high-risk transaction requiring review” unless an organisation's validated model is explicitly approved to make a fraud classification.

## What works in the included demo

The demo is immediately usable after starting the application. It includes an executive dashboard, audit-case and transaction queues, control and evidence workspaces, a model registry, report-generation journey, a detailed investigation case, reviewer notes and reviewer decision actions. Its data and adapter outputs are synthetic. A created demo case is shown as queued in the interface; it is not a substitute for a production database or a real model-processing queue.

## End-to-end workflow

1. A ledger export or source-system event is mapped into AuditFlow's canonical transaction fields.
2. Organisation preprocessing prepares the data for its anomaly model.
3. A model adapter returns a standard result, regardless of whether the internal model is XGBoost, an autoencoder, or an external API.
4. The audit engine applies the relevant control and sends available documents to the evidence adapter.
5. The control classifier produces an organisation-defined outcome, such as `MISSING_APPROVAL` or `PASS`.
6. The conclusion adapter brings the AI prediction, evidence and control assessment together in plain language.
7. An authorised reviewer approves, rejects or sends the case for further review. Their decision and note become part of the audit trail.

## The four AI/ML components

**Transaction anomaly detection** finds unusual patterns, such as an amount that differs from comparable activity or an unusual approval sequence. It produces a score, confidence, model version and relevant signals.

**Document/evidence verification** determines which required documents were found and whether their contents support the requirement. It may be powered by OCR, NLP, embeddings, vision models, an LLM, or a RAG (retrieval-augmented generation) pipeline. RAG means the model is given relevant retrieved documents before it answers; it does not make the retrieved documents automatically correct.

**Control violation classification** assesses a specific internal control using configurable classes. It should not be confused with the anomaly model: a transaction can look unusual but still pass a control, or look ordinary but fail a control.

**Explainable audit conclusion** combines the prior outputs into a concise, evidence-linked explanation for a person. The flow is always: AI prediction → evidence → control assessment → explanation → human review → final decision.

## Example audit case

A $148,500 professional-services payment exceeds the organisation’s $100,000 dual-approval threshold. The anomaly model assigns a high score. The verifier finds an invoice, purchase order, bank confirmation and first approval, but cannot find the second approval. The classifier returns `MISSING_APPROVAL`. AuditFlow creates a review-required case with those facts; an auditor must confirm the outcome before closure.

## Who uses it

Administrators manage configuration and access. Auditors investigate cases and record conclusions. Compliance Officers monitor control performance and policy issues. Finance Reviewers provide business context and evidence. Read Only users can view results without changing them.

## Finance and audit vocabulary

**Audit** is an independent, structured examination of information or processes. **Compliance** asks whether rules, laws, policies or obligations have been followed. **Internal audit** is the assurance function inside an organisation. An **internal control** is a process or activity designed to manage risk; its **control objective** is the result it intends to achieve, such as ensuring material payments are authorised.

**Control testing** checks whether a control was designed appropriately and operated as intended. **Audit evidence** is information supporting an auditor’s conclusion: invoices, logs, approvals, contracts and statements are common examples. An **exception** is a departure from an expected requirement, while **risk** is the possibility and impact of an adverse event. **Materiality** is the threshold at which an issue could reasonably influence a financial or business decision.

The **General Ledger (GL)** is the central record of accounting entries. A **Journal Entry** records a financial transaction in accounts. A **reconciliation** compares two records to identify differences. **Segregation of Duties** means no one person has incompatible control over a process, for example creating and approving a payment. An **approval workflow** is the documented route through required authorisers. An **audit trail** is the immutable, traceable history of actions, evidence and decisions.

In ML, an **anomaly** is an observation that differs from a reference pattern; it is not automatically wrongdoing. **Classification** assigns an item to a class. A **confidence score** indicates the model’s certainty under its design, not truth. A **feature** is an input used by a model. **Preprocessing** validates, maps and transforms raw data before inference. **Inference** is a model’s act of generating an output. **Explainability** makes the output understandable by showing important signals and evidence. **Human-in-the-loop** means a qualified person retains decision authority.

## Important limitations

Models can be wrong, biased, unavailable, stale or based on incomplete data. Missing evidence can mean a document was not linked, not that it never existed. Confidence is not a legal conclusion. Model failures, invalid input, timeouts and malformed outputs must result in `REVIEW_REQUIRED`, never a silent pass. Organisations remain responsible for policy definition, model validation, access control, retention and final decisions.

The starter application is an integration-ready demo, not a production deployment. It deliberately uses synthetic data, demo authentication and a small in-memory audit-event repository. A production organisation must connect its own ledger/data source, document storage, persistent tenant-scoped database, approved identity provider, reporting service and model infrastructure.
