import os
import json
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.database import engine, Base, SessionLocal
from .models.models import (
    User, StudentProfile, WebinarCategory, WebinarSource, Webinar,
    SavedWebinar, WebinarRegistration, Notification, UserReport, SynchronizationLog
)
from .core.security import hash_password
from .api.endpoints import router as api_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WebinarMatch API",
    description="Backend API for AI-Powered Webinar Discovery & Recommendation System for Students",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health():
    return {"status": "healthy"}

# Mount Frontend Static Build if present
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist")

if os.path.exists(DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        # Allow /api and /health to be handled by routers
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(DIST_DIR, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "app": "WebinarMatch API",
            "status": "online",
            "version": "1.0.0",
            "timestamp": datetime.utcnow().isoformat()
        }

# Automatic Database Seeding on First Startup
@app.on_event("startup")
def seed_database():
    db = SessionLocal()
    try:
        # Check if users exist
        if db.query(User).count() == 0:
            print("[INFO] Seeding initial users...")
            # 1. Admin
            admin = User(
                email="admin@webinarmatch.org",
                hashed_password=hash_password("admin123"),
                full_name="Dr. Sarah Jenkins",
                role="admin",
                is_active=True
            )
            db.add(admin)

            # 2. Student
            student = User(
                email="student@university.edu",
                hashed_password=hash_password("student123"),
                full_name="Alex Chen",
                role="student",
                is_active=True
            )
            db.add(student)
            db.commit()

            # Profile
            profile = StudentProfile(
                user_id=student.id,
                university="State University of Technology",
                major="Computer Science & Software Engineering",
                academic_year="Junior (3rd Year)",
                career_goals="Seeking internship in AI Engineering and Cloud Infrastructure"
            )
            profile.interests = ["Artificial Intelligence", "Cybersecurity", "Web Development", "Cloud Computing", "Data Science"]
            profile.preferred_platforms = ["Zoom", "Google Meet", "Microsoft Teams", "YouTube Live"]
            db.add(profile)
            db.commit()

        # Check if categories exist
        if db.query(WebinarCategory).count() == 0:
            print("[INFO] Seeding webinar categories...")
            categories_data = [
                {"name": "AI & Machine Learning", "slug": "ai-ml", "description": "Deep learning, LLMs, computer vision, and prompt engineering.", "icon": "Bot", "display_order": 1},
                {"name": "Cybersecurity & Ethical Hacking", "slug": "cybersecurity", "description": "Network defense, penetration testing, threat hunting, and forensics.", "icon": "Shield", "display_order": 2},
                {"name": "Cloud Computing & DevOps", "slug": "cloud-devops", "description": "AWS, GCP, Azure, Docker, Kubernetes, and serverless.", "icon": "Cloud", "display_order": 3},
                {"name": "Web & Mobile Engineering", "slug": "web-mobile", "description": "Modern full-stack, React, Next.js, and mobile development.", "icon": "Code", "display_order": 4},
                {"name": "Data Science & Big Data", "slug": "data-science", "description": "Exploratory data analysis, Pandas, visualization, and pipelines.", "icon": "Database", "display_order": 5},
                {"name": "Academic & Career Readiness", "slug": "career-readiness", "description": "Technical interviews, capstone research preparation, and writing.", "icon": "GraduationCap", "display_order": 6},
                {"name": "Health Sciences & Biomedical", "slug": "health-sciences", "description": "Clinical medicine, nursing, maternal health, healthcare AI, and biomedical technologies.", "icon": "HeartPulse", "display_order": 7},
            ]
            for c in categories_data:
                db.add(WebinarCategory(**c))
            db.commit()

        # Check if sources exist
        if db.query(WebinarSource).count() == 0:
            print("[INFO] Seeding webinar sources...")
            sources_data = [
                {"name": "IEEE Computer Society Educational Webinars", "code": "ieee_cs", "source_type": "official_api", "base_url": "https://computer.org/education/webinars", "sync_frequency": "Every 6 hours", "status": "active", "records_count": 8},
                {"name": "Google Developer Student Clubs Live Feed", "code": "gdsc_feed", "source_type": "feed", "base_url": "https://developers.google.com/community/gdsc/webinars", "sync_frequency": "Every 12 hours", "status": "active", "records_count": 6},
                {"name": "AWS Educate Student Webinar Series", "code": "aws_educate", "source_type": "official_api", "base_url": "https://aws.amazon.com/education/awseducate/webinars", "sync_frequency": "Daily", "status": "active", "records_count": 5},
                {"name": "ACM Student Chapters Global Webinar Series", "code": "acm_global", "source_type": "official_api", "base_url": "https://www.acm.org/chapters/students/webinars", "sync_frequency": "Daily", "status": "active", "records_count": 3},
                {"name": "Verified University & Faculty Imports", "code": "admin_imports", "source_type": "manual_import", "base_url": "https://webinarmatch.org/imports", "sync_frequency": "Manual / On-demand", "status": "idle", "records_count": 2},
            ]
            for s in sources_data:
                db.add(WebinarSource(**s, last_sync_at=datetime.utcnow(), last_sync_status="Healthy (200 OK)"))
            db.commit()

        # Ensure all 7 requested investigation sources are registered in WebinarSource
        requested_sources = [
            {
                "name": "NIST NICE Cybersecurity Series",
                "code": "nist_nice",
                "source_type": "feed",
                "base_url": "https://www.nist.gov/itl/applied-cybersecurity/nice/events/webinars",
                "sync_frequency": "Bi-weekly",
                "status": "active"
            },
            {
                "name": "ROC.PH Philippine Learning Series",
                "code": "roc_ph",
                "source_type": "feed",
                "base_url": "https://roc.ph/webinars/",
                "sync_frequency": "Weekly",
                "status": "active"
            },
            {
                "name": "Techstrong Learning Webinars",
                "code": "techstrong",
                "source_type": "manual_import",
                "base_url": "https://techstronglearning.com/",
                "sync_frequency": "Manual / Assisted Import",
                "status": "idle"
            },
            {
                "name": "AllAI Events Webinar Directory",
                "code": "allai",
                "source_type": "manual_import",
                "base_url": "https://allai.events/events/type/webinar",
                "sync_frequency": "Manual / Assisted Import",
                "status": "idle"
            },
            {
                "name": "KnowBe4 Security Webinar Library",
                "code": "knowbe4",
                "source_type": "manual_import",
                "base_url": "https://www.knowbe4.com/webinar-library",
                "sync_frequency": "Manual / Assisted Import",
                "status": "idle"
            },
            {
                "name": "Gartner Tech & Executive Webinars",
                "code": "gartner",
                "source_type": "manual_import",
                "base_url": "https://emt.gartnerweb.com/en/webinars?SessionType=upcoming",
                "sync_frequency": "Manual / Assisted Import",
                "status": "idle"
            },
            {
                "name": "ISACA Online Training Webinars",
                "code": "isaca",
                "source_type": "manual_import",
                "base_url": "https://www.isaca.org/training-and-events/online-training/webinars",
                "sync_frequency": "Manual / Assisted Import",
                "status": "idle"
            },
        ]
        for src in requested_sources:
            existing_src = db.query(WebinarSource).filter(WebinarSource.code == src["code"]).first()
            if not existing_src:
                db.add(WebinarSource(
                    **src,
                    records_count=0,
                    last_sync_at=datetime.utcnow(),
                    last_sync_status="Configured & Ready"
                ))
        db.commit()

        # Check if webinars exist
        if db.query(Webinar).count() == 0:
            print("[INFO] Seeding verified webinars...")
            now = datetime.utcnow()
            webinars_data = [
                {
                    "title": "Architecting Scalable Microservices on Kubernetes",
                    "slug": "architecting-scalable-microservices-kubernetes",
                    "short_description": "Learn modern distributed cloud architectures, service mesh configuration, and auto-scaling patterns for student projects.",
                    "full_description": "In this technical webinar hosted by IEEE Computer Society, senior software architects explain how to design resilient microservices applications. Topics include containerization best practices, ingress controllers, observability with Prometheus, and zero-downtime deployment strategies. Ideal for computer science students building distributed capstone projects.",
                    "category_id": 3,
                    "source_id": 1,
                    "external_id": "IEEE-WB-2026-904",
                    "start_time": now + timedelta(days=2, hours=14),
                    "end_time": now + timedelta(days=2, hours=16),
                    "timezone": "UTC+8",
                    "registration_deadline": now + timedelta(days=2),
                    "speaker_name": "Dr. Marcus Vance",
                    "speaker_title": "Principal Cloud Architect",
                    "speaker_organization": "IEEE Cloud Technical Committee",
                    "organizer_name": "IEEE Computer Society",
                    "webinar_platform": "Zoom",
                    "is_free": True,
                    "certificate_available": True,
                    "registration_url": "https://zoom.us/webinar/register/WN_ieee904k8s",
                    "is_verified": True,
                    "verification_badge": "IEEE Verified Academic Webinar",
                    "status": "upcoming",
                    "tags_json": '["Kubernetes", "Microservices", "Cloud", "Docker", "IEEE", "Certificate"]',
                    "eligibility_notes": "Free for enrolled university undergraduate and postgraduate students.",
                    "target_audience": "Computer Science, Software Engineering, and IT majors",
                    "language": "English",
                    "attendance_count": 342
                },
                {
                    "title": "Defensive Security & Threat Hunting: Zero Trust in Practice",
                    "slug": "defensive-security-threat-hunting-zero-trust",
                    "short_description": "Hands-on webinar covering modern threat intelligence, intrusion detection, and Zero Trust implementation frameworks.",
                    "full_description": "Join cybersecurity researcher Elena Rostova for an intensive look into live threat hunting. Participants will learn how modern security operations centers (SOC) analyze telemetry, correlate SIEM alerts, and mitigate advanced persistent threats (APT). Includes live demonstrations of packet inspection and behavioral analysis tools.",
                    "category_id": 2,
                    "source_id": 4,
                    "external_id": "ACM-CYB-2026-44",
                    "start_time": now + timedelta(days=3, hours=10),
                    "end_time": now + timedelta(days=3, hours=12),
                    "timezone": "UTC+8",
                    "registration_deadline": now + timedelta(days=1, hours=18),
                    "speaker_name": "Elena Rostova, CISSP",
                    "speaker_title": "Senior Cyber Defense Lead",
                    "speaker_organization": "ACM SIGSAC",
                    "organizer_name": "ACM Student Chapter",
                    "webinar_platform": "Microsoft Teams",
                    "is_free": True,
                    "certificate_available": True,
                    "registration_url": "https://teams.microsoft.com/registration/acm-threat-hunting",
                    "is_verified": True,
                    "verification_badge": "ACM Official Certified Webinar",
                    "status": "upcoming",
                    "tags_json": '["Cybersecurity", "Threat Hunting", "Zero Trust", "Ethical Hacking", "SIEM", "Certificate"]',
                    "eligibility_notes": "Open to all academic institutions. Certificate issued upon completing the post-webinar assessment.",
                    "target_audience": "Cybersecurity, Information Security, and Computer Networks students",
                    "language": "English",
                    "attendance_count": 512
                },
                {
                    "title": "Building Production AI Agents with Retrieval-Augmented Generation (RAG)",
                    "slug": "building-production-ai-agents-rag",
                    "short_description": "Comprehensive guide to building agentic workflows, vector embeddings, semantic search, and evaluation pipelines.",
                    "full_description": "This webinar dives deep into modern GenAI application engineering. We explore chunking strategies, pgvector and semantic vector stores, hybrid search reranking, and multi-agent coordination. Students will see end-to-end demonstrations of integrating LLMs with structured databases.",
                    "category_id": 1,
                    "source_id": 2,
                    "external_id": "GDSC-AI-2026-118",
                    "start_time": now + timedelta(days=4, hours=15),
                    "end_time": now + timedelta(days=4, hours=17),
                    "timezone": "UTC+8",
                    "registration_deadline": now + timedelta(days=3),
                    "speaker_name": "Kavita Patel",
                    "speaker_title": "Google Developer Expert (AI/ML)",
                    "speaker_organization": "Google Developer Community",
                    "organizer_name": "Google Developer Student Clubs",
                    "webinar_platform": "Google Meet",
                    "is_free": True,
                    "certificate_available": True,
                    "registration_url": "https://meet.google.com/registration/gdsc-ai-rag-2026",
                    "is_verified": True,
                    "verification_badge": "GDSC Verified Official Webinar",
                    "status": "upcoming",
                    "tags_json": '["Artificial Intelligence", "RAG", "LLMs", "Vector Search", "Python", "Google", "Certificate"]',
                    "eligibility_notes": "Free registration for student developers. Digital certificate of participation provided.",
                    "target_audience": "AI, Data Science, and Computer Engineering students",
                    "language": "English",
                    "attendance_count": 678
                },
                {
                    "title": "Serverless Application Architecture on AWS for University Projects",
                    "slug": "serverless-architecture-aws-university-projects",
                    "short_description": "Learn how to deploy cost-effective, scalable serverless backends using AWS Lambda, DynamoDB, and API Gateway.",
                    "full_description": "Presented by AWS Educate, this webinar teaches students how to build zero-maintenance web application backends. We walk through AWS Lambda execution triggers, infrastructure as code with SAM, serverless authentication with Amazon Cognito, and staying within the AWS Free Tier during academic development.",
                    "category_id": 3,
                    "source_id": 3,
                    "external_id": "AWS-EDU-2026-08",
                    "start_time": now + timedelta(days=5, hours=13),
                    "end_time": now + timedelta(days=5, hours=15),
                    "timezone": "UTC+8",
                    "registration_deadline": now + timedelta(days=4),
                    "speaker_name": "Julian Sterling",
                    "speaker_title": "Senior Solutions Architect, Higher Ed",
                    "speaker_organization": "Amazon Web Services",
                    "organizer_name": "AWS Educate",
                    "webinar_platform": "Zoom",
                    "is_free": True,
                    "certificate_available": True,
                    "registration_url": "https://aws.amazon.com/webinars/serverless-student-series",
                    "is_verified": True,
                    "verification_badge": "AWS Official Educational Webinar",
                    "status": "upcoming",
                    "tags_json": '["AWS", "Serverless", "Lambda", "Cloud", "DynamoDB", "Certificate"]',
                    "attendance_count": 420
                },
                {
                    "title": "Python for Data Analysis: From Raw Data to Actionable Insights",
                    "slug": "python-data-analysis-actionable-insights",
                    "short_description": "Master Pandas, NumPy, and Seaborn for university lab assignments and research data processing.",
                    "full_description": "Data science educators walk through the entire exploratory data analysis (EDA) pipeline. Learn efficient vectorization, cleaning messy datasets, handling missing values, calculating statistical metrics, and designing publication-ready charts using Python.",
                    "category_id": 5,
                    "source_id": 1,
                    "external_id": "IEEE-DS-2026-301",
                    "start_time": now + timedelta(days=6, hours=16),
                    "end_time": now + timedelta(days=6, hours=18),
                    "timezone": "UTC+8",
                    "registration_deadline": now + timedelta(days=5, hours=12),
                    "speaker_name": "Prof. David Lin",
                    "speaker_title": "Chair of Data Science Curriculum",
                    "speaker_organization": "IEEE CIS",
                    "organizer_name": "IEEE Computer Society",
                    "webinar_platform": "YouTube Live",
                    "is_free": True,
                    "certificate_available": False,
                    "registration_url": "https://youtube.com/live/ieee-python-data-science",
                    "is_verified": True,
                    "verification_badge": "IEEE Verified Academic Webinar",
                    "status": "upcoming",
                    "tags_json": '["Python", "Data Science", "Pandas", "Data Analysis", "IEEE"]',
                    "attendance_count": 290
                },
                {
                    "title": "Full-Stack React & Next.js 15: Server Actions and Modern UI Patterns",
                    "slug": "fullstack-react-nextjs-server-actions",
                    "short_description": "Explore the newest features of React 19 and Next.js App Router for high-performance student web projects.",
                    "full_description": "A deep technical dive into React Server Components, server actions, streaming SSR, and optimistic UI updates. This session is crafted for students aiming to build impressive senior capstone web applications.",
                    "category_id": 4,
                    "source_id": 2,
                    "external_id": "GDSC-WEB-2026-88",
                    "start_time": now + timedelta(days=7, hours=11),
                    "end_time": now + timedelta(days=7, hours=13),
                    "timezone": "UTC+8",
                    "registration_deadline": now + timedelta(days=6),
                    "speaker_name": "Sarah Connor",
                    "speaker_title": "Frontend Tech Lead",
                    "speaker_organization": "Google Developer Community",
                    "organizer_name": "Google Developer Student Clubs",
                    "webinar_platform": "Zoom",
                    "is_free": True,
                    "certificate_available": True,
                    "registration_url": "https://gdsc.community.dev/events/react-nextjs-deepdive",
                    "is_verified": True,
                    "verification_badge": "GDSC Verified Official Webinar",
                    "status": "upcoming",
                    "tags_json": '["React", "Next.js", "Frontend", "TypeScript", "Web Development", "Certificate"]',
                    "attendance_count": 730
                },
                {
                    "title": "Mastering Technical Interviews: Algorithms, System Design & Live Coding",
                    "slug": "mastering-technical-interviews-algorithms-system-design",
                    "short_description": "Crucial tips, mock coding sessions, and communication strategies for tech internships and graduate roles.",
                    "full_description": "Hiring managers and alumni from top tech companies share actionable methodologies for conquering technical interviews. Topics include whiteboard algorithmic patterns, trade-off analysis during system design rounds, and navigating behavioral questions with the STAR method.",
                    "category_id": 6,
                    "source_id": 4,
                    "external_id": "ACM-CAR-2026-15",
                    "start_time": now + timedelta(days=8, hours=18),
                    "end_time": now + timedelta(days=8, hours=20),
                    "timezone": "UTC+8",
                    "registration_deadline": now + timedelta(days=7),
                    "speaker_name": "Michael Torres",
                    "speaker_title": "Staff Software Engineer & Interview Coach",
                    "speaker_organization": "ACM Mentorship Council",
                    "organizer_name": "ACM Student Chapter",
                    "webinar_platform": "Webex",
                    "is_free": True,
                    "certificate_available": False,
                    "registration_url": "https://acm.webex.com/acm/tech-interview-prep",
                    "is_verified": True,
                    "verification_badge": "ACM Official Certified Webinar",
                    "status": "upcoming",
                    "tags_json": '["Interview Prep", "Career", "Algorithms", "System Design", "ACM"]',
                    "attendance_count": 850
                },
                {
                    "title": "Computer Vision & Deep Learning with PyTorch for Robotics",
                    "slug": "computer-vision-deep-learning-pytorch-robotics",
                    "short_description": "Implement YOLO object detection, image segmentation, and edge deployment for autonomous robotic systems.",
                    "full_description": "An advanced academic webinar on computer vision architectures. Learn how convolutional backbones and transformer-based vision models (ViT) are adapted for real-time robotic perception and edge computing on embedded hardware.",
                    "category_id": 1,
                    "source_id": 1,
                    "external_id": "IEEE-ROB-2026-612",
                    "start_time": now + timedelta(days=9, hours=14),
                    "end_time": now + timedelta(days=9, hours=16, minutes=30),
                    "timezone": "UTC+8",
                    "registration_deadline": now + timedelta(days=8),
                    "speaker_name": "Dr. Anya Sharma",
                    "speaker_title": "Director of Autonomous Perception Lab",
                    "speaker_organization": "IEEE RAS",
                    "organizer_name": "IEEE Computer Society",
                    "webinar_platform": "Zoom",
                    "is_free": False,
                    "price_amount": 15.0,
                    "currency": "USD",
                    "certificate_available": True,
                    "registration_url": "https://ieee.org/webinars/pytorch-robotics-vision",
                    "is_verified": True,
                    "verification_badge": "IEEE Verified Academic Webinar",
                    "status": "upcoming",
                    "tags_json": '["PyTorch", "Computer Vision", "Deep Learning", "Robotics", "IEEE", "Certificate"]',
                    "attendance_count": 180
                },
                {
                    "title": "Applied Cryptography & Secure Protocol Design",
                    "slug": "applied-cryptography-secure-protocol-design",
                    "short_description": "Understand public-key cryptography, post-quantum encryption standards, TLS 1.3, and practical key exchange.",
                    "full_description": "Cryptographic vulnerabilities frequently compromise otherwise solid web systems. This academic session breaks down elliptic-curve cryptography, constant-time algorithms, and the newly ratified NIST post-quantum cryptographic standards (FIPS 203/204).",
                    "category_id": 2,
                    "source_id": 4,
                    "external_id": "ACM-CRY-2026-29",
                    "start_time": now + timedelta(days=10, hours=9),
                    "end_time": now + timedelta(days=10, hours=11),
                    "timezone": "UTC+8",
                    "registration_deadline": now + timedelta(days=9),
                    "speaker_name": "Prof. Alexander Reed",
                    "speaker_title": "Chair of Cryptography Research Group",
                    "speaker_organization": "ACM SIGSAC",
                    "organizer_name": "ACM Student Chapter",
                    "webinar_platform": "Microsoft Teams",
                    "is_free": True,
                    "certificate_available": True,
                    "registration_url": "https://teams.microsoft.com/registration/acm-cryptography",
                    "is_verified": True,
                    "verification_badge": "ACM Official Certified Webinar",
                    "status": "upcoming",
                    "tags_json": '["Cryptography", "Cybersecurity", "Encryption", "Security Protocols", "Certificate"]',
                    "attendance_count": 310
                },
                {
                    "title": "Publishing Your First Capstone Paper: From Research to Review",
                    "slug": "publishing-first-capstone-paper-research-review",
                    "short_description": "Academic paper structuring, literature review methodology, IEEE/ACM formatting, and peer review tips.",
                    "full_description": "Transitioning undergraduate research into peer-reviewed conference or journal publications requires adherence to formal academic criteria. This webinar walks students through abstract crafting, experimental reproducibility documentation, and managing peer review revisions.",
                    "category_id": 6,
                    "source_id": 5,
                    "external_id": "UNI-RES-2026-03",
                    "start_time": now + timedelta(days=11, hours=15),
                    "end_time": now + timedelta(days=11, hours=17),
                    "timezone": "UTC+8",
                    "registration_deadline": now + timedelta(days=10),
                    "speaker_name": "Dr. Rebecca Martinez",
                    "speaker_title": "Associate Editor & Senior Faculty Member",
                    "speaker_organization": "University Research Council",
                    "organizer_name": "Inter-Collegiate Academic Board",
                    "webinar_platform": "Zoom",
                    "is_free": True,
                    "certificate_available": True,
                    "registration_url": "https://zoom.us/webinar/register/WN_research_pub_2026",
                    "is_verified": True,
                    "verification_badge": "Faculty Verified Academic Webinar",
                    "status": "upcoming",
                    "tags_json": '["Research", "Academic Publishing", "Capstone", "Writing", "Certificate"]',
                    "attendance_count": 460
                },
                {
                    "title": "Maternal Health & Prenatal Care in Digital Medicine: AI & Clinical Innovations",
                    "slug": "maternal-health-prenatal-care-digital-medicine",
                    "short_description": "Explore modern clinical and digital health innovations in maternal monitoring, prenatal care, and predictive obstetrics analytics for student learning.",
                    "full_description": "This academic webinar presents breakthrough technologies in digital medicine, remote maternal monitoring, and prenatal health data analysis for nursing, pre-med, health informatics, and biomedical students. Topics cover high-risk pregnancy risk stratification, wearable fetal monitoring sensors, clinical obstetrics protocols, and ethical healthcare AI.",
                    "category_id": 7,
                    "source_id": 1,
                    "external_id": "EMBS-HLT-2026-102",
                    "start_time": now + timedelta(days=3, hours=14),
                    "end_time": now + timedelta(days=3, hours=16),
                    "timezone": "UTC+8",
                    "registration_deadline": now + timedelta(days=2, hours=18),
                    "speaker_name": "Dr. Rachel Vance, MD",
                    "speaker_title": "Director of Maternal-Fetal Medicine & Health Informatics",
                    "speaker_organization": "IEEE Engineering in Medicine & Biology Society",
                    "organizer_name": "IEEE EMBS Student Chapter",
                    "webinar_platform": "Zoom",
                    "is_free": True,
                    "certificate_available": True,
                    "registration_url": "https://zoom.us/webinar/register/WN_maternal_health_2026",
                    "is_verified": True,
                    "verification_badge": "IEEE EMBS Verified Medical Webinar",
                    "status": "upcoming",
                    "tags_json": '["Pregnancy", "Maternal Health", "Prenatal Care", "Digital Health", "Obstetrics", "Nursing", "Medicine", "Health Informatics", "Certificate"]',
                    "eligibility_notes": "Free for enrolled university health sciences, nursing, pre-med, and engineering students.",
                    "target_audience": "Nursing, Health Sciences, Pre-Med, and Biomedical Engineering students",
                    "language": "English",
                    "attendance_count": 420
                },
                {
                    "title": "Clinical Advances in Maternal & Neonatal Health: Evidence-Based Care",
                    "slug": "clinical-advances-maternal-neonatal-health",
                    "short_description": "Evidence-based clinical guidelines and contemporary research in maternal, pregnancy, and neonatal patient outcomes.",
                    "full_description": "An essential evidence-based academic lecture examining modern clinical practices in obstetrics, pregnancy and prenatal care, labor and delivery, and neonatal intensive care. Students will analyze recent clinical trials, patient intervention frameworks, and collaborative multidisciplinary healthcare protocols.",
                    "category_id": 7,
                    "source_id": 4,
                    "external_id": "EMBS-HLT-2026-103",
                    "start_time": now + timedelta(days=5, hours=9),
                    "end_time": now + timedelta(days=5, hours=11),
                    "timezone": "UTC+8",
                    "registration_deadline": now + timedelta(days=4),
                    "speaker_name": "Prof. Maria Santos, PhD, RN",
                    "speaker_title": "Professor of Perinatal Nursing & Clinical Research",
                    "speaker_organization": "Global Nursing & Health Academic Consortium",
                    "organizer_name": "Academic Nursing & Healthcare Student Guild",
                    "webinar_platform": "Google Meet",
                    "is_free": True,
                    "certificate_available": True,
                    "registration_url": "https://meet.google.com/registration/maternal-neonatal-2026",
                    "is_verified": True,
                    "verification_badge": "Global Health Guild Verified Webinar",
                    "status": "upcoming",
                    "tags_json": '["Pregnancy", "Maternal Care", "Neonatal", "Clinical Nursing", "Pediatrics", "Evidence-Based Medicine", "Patient Care", "Certificate"]',
                    "eligibility_notes": "Open to all healthcare, nursing, and medical students. Verified digital attendance certificate awarded upon completion.",
                    "target_audience": "Nursing, Midwifery, Clinical Medicine, and Public Health students",
                    "language": "English",
                    "attendance_count": 310
                },
                # Expired webinar for testing expired webinar detection and archival retention
                {
                    "title": "Historical Archive: Introduction to Git and Open Source for Beginners",
                    "slug": "intro-git-open-source-beginners",
                    "short_description": "Foundational webinar covering Git branching, rebasing, pull requests, and contributing to open source repositories.",
                    "full_description": "This past session taught students foundational version control workflows using Git and GitHub. Archived for student records and historical requirement verification.",
                    "category_id": 4,
                    "source_id": 2,
                    "external_id": "GDSC-GIT-2026-01",
                    "start_time": now - timedelta(days=10),
                    "end_time": now - timedelta(days=10) + timedelta(hours=2),
                    "timezone": "UTC+8",
                    "registration_deadline": now - timedelta(days=11),
                    "speaker_name": "Leo Zhang",
                    "speaker_title": "GDSC Tech Lead",
                    "speaker_organization": "Google Developer Community",
                    "organizer_name": "Google Developer Student Clubs",
                    "webinar_platform": "YouTube Live",
                    "is_free": True,
                    "certificate_available": True,
                    "registration_url": "https://youtube.com/live/gdsc-git-archive",
                    "is_verified": True,
                    "verification_badge": "GDSC Verified Official Webinar",
                    "status": "completed",
                    "tags_json": '["Git", "GitHub", "Open Source", "Archived"]',
                    "attendance_count": 940
                }
            ]
            for w in webinars_data:
                db.add(Webinar(**w))
            db.commit()

        # Seed initial saved webinar and registration for demo student
        student_user = db.query(User).filter(User.role == "student").first()
        if student_user and db.query(SavedWebinar).filter(SavedWebinar.user_id == student_user.id).count() == 0:
            w1 = db.query(Webinar).first()
            if w1:
                db.add(SavedWebinar(user_id=student_user.id, webinar_id=w1.id, notes="Semester Capstone Project Reference"))
                db.add(WebinarRegistration(user_id=student_user.id, webinar_id=w1.id, status="registered", notes="Registered using student email"))
                db.commit()

        # Seed initial notifications
        if student_user and db.query(Notification).filter(Notification.user_id == student_user.id).count() == 0:
            db.add(Notification(
                user_id=student_user.id,
                title="Webinar Starting Soon",
                message='"Architecting Scalable Microservices on Kubernetes" begins soon. Check your calendar!',
                type="starting_soon"
            ))
            db.add(Notification(
                user_id=student_user.id,
                title="Registration Deadline Approaching",
                message='Registration closes soon for "Defensive Security & Threat Hunting: Zero Trust in Practice".',
                type="deadline_warning"
            ))
            db.commit()

        print("[SUCCESS] Database initialized and verified!")

    finally:
        db.close()
