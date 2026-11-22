import sys
import time
import requests
import subprocess
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000"

def run_all_tests():
    print("=" * 60)
    print("RUNNING WEBINARMATCH AUTOMATED SYSTEM TESTS")
    print("=" * 60)

    # 1. Health
    res = requests.get(f"{BASE_URL}/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print("[PASS] 1. Health Endpoint (200 OK)")

    # 2. Categories
    res = requests.get(f"{BASE_URL}/api/categories")
    assert res.status_code == 200
    cats = res.json()
    assert len(cats) >= 6
    print(f"[PASS] 2. Webinar Categories ({len(cats)} categories verified)")

    # 3. Sources
    res = requests.get(f"{BASE_URL}/api/sources")
    assert res.status_code == 200
    sources = res.json()
    assert len(sources) >= 4
    print(f"[PASS] 3. Data Aggregation Sources ({len(sources)} verified sources)")

    # 4. Catalog & Multi-filtering
    res = requests.get(f"{BASE_URL}/api/webinars?is_free=true")
    assert res.status_code == 200
    free_webinars = res.json()
    assert all(w["is_free"] for w in free_webinars["webinars"])
    print(f"[PASS] 4. Multi-Filter Deterministic Free Check ({free_webinars['total']} free webinars)")

    # 5. Certificate filter
    res = requests.get(f"{BASE_URL}/api/webinars?certificate_available=true")
    assert res.status_code == 200
    cert_webinars = res.json()
    assert all(w["certificate_available"] for w in cert_webinars["webinars"])
    print(f"[PASS] 5. Certificate Requirement Filter ({cert_webinars['total']} with certificate)")

    # 6. AI Natural Language & Semantic Search
    res = requests.post(f"{BASE_URL}/api/webinars/search-ai?query=How+to+protect+computer+systems+against+hackers")
    assert res.status_code == 200
    ai_res = res.json()
    assert ai_res["total"] > 0
    top_w = ai_res["webinars"][0]
    print(f"[PASS] 6. AI Semantic Concept Search ('protect computer systems' -> matched '{top_w['title']}' with score {top_w['similarity_score']})")

    # 7. AI Hard Constraints Extraction & Enforcement
    res = requests.post(f"{BASE_URL}/api/webinars/search-ai?query=free+cybersecurity+webinars+with+certificate")
    assert res.status_code == 200
    hard_res = res.json()
    assert hard_res["total"] > 0
    for w in hard_res["webinars"]:
        assert w["is_free"] is True
        assert w["certificate_available"] is True
    print(f"[PASS] 7. AI Constraint Extraction (Enforced: free=True, certificate=True, summary='{hard_res['parsed_intent']['interpretation_summary']}')")

    # 8. Explainable AI Recommendations
    res = requests.get(f"{BASE_URL}/api/webinars/recommendations/for-you")
    assert res.status_code == 200
    recs = res.json()
    assert len(recs) > 0
    assert all("recommendation_reason" in r and r["recommendation_reason"] for r in recs)
    print(f"[PASS] 8. Explainable Recommendations ({len(recs)} suggestions generated with reasons)")

    # 9. Bookmarks / Save Webinar
    res = requests.post(f"{BASE_URL}/api/saved/1?notes=Capstone+Requirement")
    assert res.status_code == 200
    saved_list = requests.get(f"{BASE_URL}/api/saved").json()
    assert any(s["webinar_id"] == 1 for s in saved_list)
    print(f"[PASS] 9. Bookmark & Save Workflow (Persisted to database)")

    # 10. Registration Status Tracker
    res = requests.post(f"{BASE_URL}/api/registrations/2", json={"status": "registered", "notes": "Registered via Zoom link"})
    assert res.status_code == 200
    reg_list = requests.get(f"{BASE_URL}/api/registrations").json()
    assert any(r["webinar_id"] == 2 and r["status"] == "registered" for r in reg_list)
    print(f"[PASS] 10. Participation Tracker (Updated status to 'registered')")

    # 11. Schedule Conflict Detection
    res = requests.get(f"{BASE_URL}/api/calendar/conflicts/1")
    assert res.status_code == 200
    print(f"[PASS] 11. Schedule Conflict Detector Endpoint (Operational)")

    # 12. Admin Metrics
    res = requests.get(f"{BASE_URL}/api/admin/metrics")
    assert res.status_code == 200
    metrics = res.json()
    assert metrics["total_webinars"] >= 10
    print(f"[PASS] 12. Administrator Metrics (Students: {metrics['total_students']}, Webinars: {metrics['total_webinars']}, Expired: {metrics['expired_webinars']})")

    # 13. External Data Source Sync Runner
    res = requests.post(f"{BASE_URL}/api/admin/sources/1/sync")
    assert res.status_code == 200
    sync_log = res.json()
    assert sync_log["status"] == "success"
    print(f"[PASS] 13. External Source Synchronization (Source: {sync_log['source_name']}, Fetched: {sync_log['records_fetched']})")

    # 14. Static SPA Frontend Serving
    res = requests.get(f"{BASE_URL}/")
    assert res.status_code == 200
    assert "WebinarMatch" in res.text
    print(f"[PASS] 14. Single Page Application Serving (200 OK, HTML loaded)")

    print("=" * 60)
    print("ALL 14 COMPREHENSIVE INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_all_tests()
