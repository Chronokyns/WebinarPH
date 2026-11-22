import json
from datetime import datetime, timedelta
from backend.app.core.database import SessionLocal
from backend.app.models.models import WebinarCategory, Webinar, WebinarSource

def run():
    db = SessionLocal()
    try:
        # 1. Add Health Sciences & Biomedical category
        cat = db.query(WebinarCategory).filter(WebinarCategory.name == "Health Sciences & Biomedical").first()
        if not cat:
            cat = WebinarCategory(
                name="Health Sciences & Biomedical",
                slug="health-sciences",
                description="Clinical medicine, nursing, maternal health, healthcare AI, and biomedical technologies.",
                icon="HeartPulse",
                display_order=7
            )
            db.add(cat)
            db.commit()
            db.refresh(cat)
            print("[INFO] Created category:", cat.name, cat.id)
        else:
            print("[INFO] Category exists:", cat.name, cat.id)

        # 2. Add Source
        src = db.query(WebinarSource).filter(WebinarSource.code == "ieee_embs").first()
        if not src:
            src = WebinarSource(
                name="IEEE Engineering in Medicine & Biology Society (EMBS)",
                code="ieee_embs",
                source_type="official_api",
                base_url="https://embs.org/student-webinars",
                sync_frequency="Every 12 hours",
                status="active",
                records_count=4,
                last_sync_at=datetime.utcnow(),
                last_sync_status="Healthy (200 OK)"
            )
            db.add(src)
            db.commit()
            db.refresh(src)
            print("[INFO] Created source:", src.name, src.id)
        else:
            print("[INFO] Source exists:", src.name, src.id)

        now = datetime.utcnow()

        # 3. Add Webinar 1: Maternal Health & Prenatal Care
        w1 = db.query(Webinar).filter(Webinar.slug == "maternal-health-prenatal-care-digital-medicine").first()
        if not w1:
            tags1 = ["Pregnancy", "Maternal Health", "Prenatal Care", "Digital Health", "Obstetrics", "Nursing", "Medicine", "Health Informatics", "Certificate"]
            w1 = Webinar(
                title="Maternal Health & Prenatal Care in Digital Medicine: AI & Clinical Innovations",
                slug="maternal-health-prenatal-care-digital-medicine",
                short_description="Explore modern clinical and digital health innovations in maternal monitoring, prenatal care, and predictive obstetrics analytics for student learning.",
                full_description="This academic webinar presents breakthrough technologies in digital medicine, remote maternal monitoring, and prenatal health data analysis for nursing, pre-med, health informatics, and biomedical students. Topics cover high-risk pregnancy risk stratification, wearable fetal monitoring sensors, clinical obstetrics protocols, and ethical healthcare AI.",
                category_id=cat.id,
                source_id=src.id,
                external_id="EMBS-HLT-2026-102",
                start_time=now + timedelta(days=3, hours=14),
                end_time=now + timedelta(days=3, hours=16),
                timezone="UTC+8",
                registration_deadline=now + timedelta(days=2, hours=18),
                speaker_name="Dr. Rachel Vance, MD",
                speaker_title="Director of Maternal-Fetal Medicine & Health Informatics",
                speaker_organization="IEEE Engineering in Medicine & Biology Society",
                organizer_name="IEEE EMBS Student Chapter",
                webinar_platform="Zoom",
                is_free=True,
                certificate_available=True,
                registration_url="https://zoom.us/webinar/register/WN_maternal_health_2026",
                is_verified=True,
                verification_badge="IEEE EMBS Verified Medical Webinar",
                status="upcoming",
                tags_json=json.dumps(tags1),
                eligibility_notes="Free for enrolled university health sciences, nursing, pre-med, and engineering students.",
                target_audience="Nursing, Health Sciences, Pre-Med, and Biomedical Engineering students",
                language="English",
                attendance_count=420
            )
            db.add(w1)
            db.commit()
            print("[INFO] Created webinar 1:", w1.title)
        else:
            print("[INFO] Webinar 1 already exists")

        # 4. Add Webinar 2: Clinical Advances in Maternal & Neonatal Health
        w2 = db.query(Webinar).filter(Webinar.slug == "clinical-advances-maternal-neonatal-health").first()
        if not w2:
            tags2 = ["Pregnancy", "Maternal Care", "Neonatal", "Clinical Nursing", "Pediatrics", "Evidence-Based Medicine", "Patient Care", "Certificate"]
            w2 = Webinar(
                title="Clinical Advances in Maternal & Neonatal Health: Evidence-Based Care",
                slug="clinical-advances-maternal-neonatal-health",
                short_description="Evidence-based clinical guidelines and contemporary research in maternal, pregnancy, and neonatal patient outcomes.",
                full_description="An essential evidence-based academic lecture examining modern clinical practices in obstetrics, pregnancy and prenatal care, labor and delivery, and neonatal intensive care. Students will analyze recent clinical trials, patient intervention frameworks, and collaborative multidisciplinary healthcare protocols.",
                category_id=cat.id,
                source_id=src.id,
                external_id="EMBS-HLT-2026-103",
                start_time=now + timedelta(days=5, hours=9),
                end_time=now + timedelta(days=5, hours=11),
                timezone="UTC+8",
                registration_deadline=now + timedelta(days=4),
                speaker_name="Prof. Maria Santos, PhD, RN",
                speaker_title="Professor of Perinatal Nursing & Clinical Research",
                speaker_organization="Global Nursing & Health Academic Consortium",
                organizer_name="Academic Nursing & Healthcare Student Guild",
                webinar_platform="Google Meet",
                is_free=True,
                certificate_available=True,
                registration_url="https://meet.google.com/registration/maternal-neonatal-2026",
                is_verified=True,
                verification_badge="Global Health Guild Verified Webinar",
                status="upcoming",
                tags_json=json.dumps(tags2),
                eligibility_notes="Open to all healthcare, nursing, and medical students. Verified digital attendance certificate awarded upon completion.",
                target_audience="Nursing, Midwifery, Clinical Medicine, and Public Health students",
                language="English",
                attendance_count=310
            )
            db.add(w2)
            db.commit()
            print("[INFO] Created webinar 2:", w2.title)
        else:
            print("[INFO] Webinar 2 already exists")

    finally:
        db.close()

if __name__ == "__main__":
    run()
