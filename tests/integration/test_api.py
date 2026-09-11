from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_dashboard_is_available():
    response = client.get('/api/dashboard')
    assert response.status_code == 200
    assert len(response.json()['metrics']) == 6

def test_read_only_reviewer_cannot_override_case():
    response = client.post('/api/cases/AC-2026-004182/decision', headers={'x-demo-role':'Read Only'}, json={'decision':'PASS','note':'Reviewed'})
    assert response.status_code == 403

def test_reviewer_override_is_recorded():
    response = client.post('/api/cases/AC-2026-004182/decision', json={'decision':'REVIEW_REQUIRED','note':'Waiting for approval evidence'})
    assert response.status_code == 200
    assert response.json()['status'] == 'REVIEW_REQUIRED'
