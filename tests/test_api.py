import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.database import SessionLocal, Base, engine
from backend.app.models.models import Webinar

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_categories():
    response = client.get("/api/categories")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 6
    assert any(c["slug"] == "ai-ml" for c in data)
    assert any(c["slug"] == "cybersecurity" for c in data)

def test_sources():
    response = client.get("/api/sources")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 4
    assert any("IEEE" in s["name"] for s in data)

def test_webinar_list():
    response = client.get("/api/webinars")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 10
    assert len(data["webinars"]) >= 10

def test_webinar_free_filter():
    response = client.get("/api/webinars?is_free=true")
    assert response.status_code == 200
    data = response.json()
    for w in data["webinars"]:
        assert w["is_free"] is True

def test_webinar_certificate_filter():
    response = client.get("/api/webinars?certificate_available=true")
    assert response.status_code == 200
    data = response.json()
    for w in data["webinars"]:
        assert w["certificate_available"] is True

def test_ai_search_cybersecurity():
    # Natural language query with implicit concept mapping
    response = client.post("/api/webinars/search-ai?query=How+to+protect+computer+systems+against+hackers")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    # Top result should be cybersecurity or threat hunting
    top_webinar = data["webinars"][0]
    assert "Defensive Security" in top_webinar["title"] or "Cybersecurity" in top_webinar["category_name"] or "Cryptography" in top_webinar["title"]

def test_ai_search_hard_constraints():
    # Free + certificate
    response = client.post("/api/webinars/search-ai?query=free+webinars+with+certificate")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    for w in data["webinars"]:
        assert w["is_free"] is True
        assert w["certificate_available"] is True
    assert data["parsed_intent"]["extracted_price"] == "free"
    assert data["parsed_intent"]["extracted_certificate"] is True

def test_ai_recommendations():
    response = client.get("/api/webinars/recommendations/for-you")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    # Every recommendation must provide an explainability reason
    for rec in data:
        assert rec["recommendation_reason"] is not None
        assert len(rec["recommendation_reason"]) > 5

def test_save_and_unsave_webinar():
    # Save webinar #1
    res_save = client.post("/api/saved/1?notes=Testing+save")
    assert res_save.status_code == 200

    # Verify in list
    res_list = client.get("/api/saved")
    assert res_list.status_code == 200
    saved_ids = [s["webinar_id"] for s in res_list.json()]
    assert 1 in saved_ids

    # Unsave
    res_del = client.delete("/api/saved/1")
    assert res_del.status_code == 200

def test_registration_tracker():
    res_track = client.post("/api/registrations/2", json={"status": "registered", "notes": "Registered via student link"})
    assert res_track.status_code == 200

    res_list = client.get("/api/registrations")
    assert res_list.status_code == 200
    tracked = res_list.json()
    entry = next((r for r in tracked if r["webinar_id"] == 2), None)
    assert entry is not None
    assert entry["status"] == "registered"

def test_schedule_conflicts():
    # Webinar #1 is on schedule
    client.post("/api/registrations/1", json={"status": "registered"})
    # Check conflicts for Webinar #1 itself
    res_conf = client.get("/api/calendar/conflicts/1")
    assert res_conf.status_code == 200

def test_admin_metrics():
    response = client.get("/api/admin/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "total_students" in data
    assert "total_webinars" in data
    assert "active_sources" in data

def test_admin_trigger_sync():
    response = client.post("/api/admin/sources/1/sync")
    assert response.status_code == 200
    log = response.json()
    assert log["status"] == "success"
    assert log["records_fetched"] > 0

if __name__ == "__main__":
    pytest.main(["-v", __file__])
