from datetime import datetime, timezone


class DemoAuditRepository:
    """Swap this for a tenant-scoped, append-only database repository in production."""
    def __init__(self):
        self.events: dict[str, list[dict]] = {}

    def append_event(self, case_id: str, actor: str, action: str, previous_status: str | None, new_status: str | None, note: str, model_version: str | None = None, preprocessing_version: str | None = None) -> dict:
        event = {"time": datetime.now(timezone.utc).isoformat(), "actor": actor, "action": action, "previous_status": previous_status, "new_status": new_status, "note": note, "model_version": model_version, "preprocessing_version": preprocessing_version}
        self.events.setdefault(case_id, []).append(event)
        return event

    def get_events(self, case_id: str) -> list[dict]:
        return list(reversed(self.events.get(case_id, [])))


audit_repository = DemoAuditRepository()
