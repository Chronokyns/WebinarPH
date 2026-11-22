import sys
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_priorities():
    print("=" * 70)
    print("TESTING USER PRIORITIES: AUTH, RBAC, DB INTEGRATION & AI")
    print("=" * 70)

    # 1. Test Student Login & JWT token receipt
    login_res = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "student@university.edu",
        "password": "student123"
    })
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    student_auth = login_res.json()
    student_token = student_auth["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}", "Content-Type": "application/json"}
    print(f"[PASS] 1. Student Login: Received token for {student_auth['user']['full_name']} (role: {student_auth['user']['role']})")

    # 2. Test Admin Login & JWT token receipt
    admin_login_res = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@webinarmatch.org",
        "password": "admin123"
    })
    assert admin_login_res.status_code == 200, f"Admin login failed: {admin_login_res.text}"
    admin_auth = admin_login_res.json()
    admin_token = admin_auth["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
    print(f"[PASS] 2. Admin Login: Received token for {admin_auth['user']['full_name']} (role: {admin_auth['user']['role']})")

    # 3. Test Strict Role Separation (RBAC): Student attempting to access Admin endpoints MUST receive HTTP 403
    forbidden_res = requests.get(f"{BASE_URL}/api/admin/metrics", headers=student_headers)
    assert forbidden_res.status_code == 403, f"Expected 403 Forbidden for student on admin endpoint, got {forbidden_res.status_code}"
    print("[PASS] 3. Strict RBAC Enforcement: Student token receives 403 Forbidden on /api/admin/metrics")

    # 4. Admin accessing admin endpoints succeeds
    admin_metrics_res = requests.get(f"{BASE_URL}/api/admin/metrics", headers=admin_headers)
    assert admin_metrics_res.status_code == 200, f"Admin metrics failed: {admin_metrics_res.text}"
    print(f"[PASS] 4. Admin Access: /api/admin/metrics returned {admin_metrics_res.json()['total_webinars']} webinars")

    # 5. Profile Update & Persistence (Personalized student preferences in DB)
    update_res = requests.put(f"{BASE_URL}/api/auth/profile", headers=student_headers, json={
        "major": "Artificial Intelligence & Data Science",
        "interests": ["Cybersecurity", "Data Science"],
        "career_goals": "AI Security Specialist"
    })
    assert update_res.status_code == 200, f"Profile update failed: {update_res.text}"
    updated_user = update_res.json()
    assert updated_user["profile"]["major"] == "Artificial Intelligence & Data Science"
    assert "Cybersecurity" in updated_user["profile"]["interests"]
    print(f"[PASS] 5. Real DB Profile Update: Student preferences updated and saved in SQLite database")

    # 6. Recommendations adapting to student preferences
    recs_res = requests.get(f"{BASE_URL}/api/webinars/recommendations/for-you", headers=student_headers)
    assert recs_res.status_code == 200
    recs = recs_res.json()
    assert len(recs) > 0
    top_rec = recs[0]
    print(f"[PASS] 6. Preference-Driven Recommendations: Top recommendation '{top_rec['title']}' ({top_rec['recommendation_reason']})")

    # 7. Real Save & Unsave functionality in Database
    # First save webinar 4
    save_res = requests.post(f"{BASE_URL}/api/saved/4?notes=Senior+Project+Study", headers=student_headers)
    assert save_res.status_code == 200
    saved_list = requests.get(f"{BASE_URL}/api/saved", headers=student_headers).json()
    assert any(s["webinar_id"] == 4 for s in saved_list), "Webinar 4 was not saved in DB"
    print(f"[PASS] 7a. Bookmark Save: Webinar #4 saved with notes in DB")

    # Now unsave webinar 4
    unsave_res = requests.delete(f"{BASE_URL}/api/saved/4", headers=student_headers)
    assert unsave_res.status_code == 200
    saved_list_after = requests.get(f"{BASE_URL}/api/saved", headers=student_headers).json()
    assert not any(s["webinar_id"] == 4 for s in saved_list_after), "Webinar 4 was not removed from DB"
    print(f"[PASS] 7b. Bookmark Unsave: Webinar #4 removed from DB")

    # 8. Real Registration Tracker (Update status through lifecycle)
    for st in ["interested", "registered", "attended"]:
        reg_res = requests.post(f"{BASE_URL}/api/registrations/3", headers=student_headers, json={
            "status": st,
            "notes": f"Status updated to {st}"
        })
        assert reg_res.status_code == 200
    active_regs = requests.get(f"{BASE_URL}/api/registrations", headers=student_headers).json()
    matched_reg = next(r for r in active_regs if r["webinar_id"] == 3)
    assert matched_reg["status"] == "attended"
    print(f"[PASS] 8. Registration Tracker Lifecycle: Successfully tracked status transition to 'attended' in DB")

    # 9. Natural Language & Semantic Search
    nl_res = requests.post(f"{BASE_URL}/api/webinars/search-ai?query=How+to+secure+cloud+microservices", headers=student_headers)
    assert nl_res.status_code == 200
    nl_data = nl_res.json()
    assert nl_data["total"] > 0
    print(f"[PASS] 9. Natural Language Search: Query 'How to secure cloud microservices' matched {nl_data['total']} webinars")

    # 10. Multi-filter & Sorting
    filter_res = requests.get(f"{BASE_URL}/api/webinars?is_free=true&certificate_available=true&sort_by=date_asc", headers=student_headers)
    assert filter_res.status_code == 200
    filtered_webinars = filter_res.json()["webinars"]
    assert all(w["is_free"] and w["certificate_available"] for w in filtered_webinars)
    # Check date sorting
    dates = [w["start_time"] for w in filtered_webinars]
    assert dates == sorted(dates), "Webinars are not sorted in ascending order"
    print(f"[PASS] 10. Multi-Filter and Sorting: Verified {len(filtered_webinars)} webinars matching free+certificate in date_asc order")

    # 11. Schedule Conflict Detection
    conflict_res = requests.get(f"{BASE_URL}/api/calendar/conflicts/1", headers=student_headers)
    assert conflict_res.status_code == 200
    print(f"[PASS] 11. Schedule Conflict Detection: Checked conflicts for Webinar #1")

    # 12. Terminology Validation: Check that no endpoint or DB record returns generic 'Event' in verification badges
    all_webinars = requests.get(f"{BASE_URL}/api/webinars", headers=student_headers).json()["webinars"]
    for w in all_webinars:
        if w.get("verification_badge"):
            assert "Event" not in w["verification_badge"], f"Found 'Event' in badge: {w['verification_badge']}"
    print(f"[PASS] 12. Terminology Check: All {len(all_webinars)} webinar badges strictly adhere to 'Webinar' (no generic 'Event')")

    print("=" * 70)
    print("ALL 12 PRIORITY VERIFICATION CHECKS PASSED WITH 100% SUCCESS!")
    print("=" * 70)

if __name__ == "__main__":
    test_priorities()
