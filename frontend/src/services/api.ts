import {
  Webinar,
  WebinarCategory,
  WebinarSource,
  SavedWebinar,
  WebinarRegistration,
  SearchFilterState,
  ParsedSearchIntent,
  UserReport,
  SynchronizationLog,
  User,
  RegistrationStatus,
  UrlPreviewResponse,
  CsvImportSummary,
} from '../types';

// Initial verified seed webinar dataset strictly conforming to WEBINAR scope
export const SEED_CATEGORIES: WebinarCategory[] = [
  { id: 1, name: 'AI & Machine Learning', slug: 'ai-ml', description: 'Deep learning, neural networks, LLMs, computer vision, and prompt engineering.', icon: 'Bot', display_order: 1, is_active: true, webinar_count: 6 },
  { id: 2, name: 'Cybersecurity & Ethical Hacking', slug: 'cybersecurity', description: 'Network defense, penetration testing, threat analysis, and digital forensics.', icon: 'Shield', display_order: 2, is_active: true, webinar_count: 4 },
  { id: 3, name: 'Cloud Computing & DevOps', slug: 'cloud-devops', description: 'AWS, Google Cloud, Azure, Docker, Kubernetes, and CI/CD pipelines.', icon: 'Cloud', display_order: 3, is_active: true, webinar_count: 4 },
  { id: 4, name: 'Web & Mobile Engineering', slug: 'web-mobile', description: 'Modern full-stack web, React, Next.js, Flutter, and cross-platform architecture.', icon: 'Code', display_order: 4, is_active: true, webinar_count: 3 },
  { id: 5, name: 'Data Science & Big Data', slug: 'data-science', description: 'Statistical analysis, Python for data, data pipelines, and business intelligence.', icon: 'Database', display_order: 5, is_active: true, webinar_count: 3 },
  { id: 6, name: 'Academic & Career Readiness', slug: 'career-readiness', description: 'Technical interviews, capstone research preparation, resume writing, and publishing.', icon: 'GraduationCap', display_order: 6, is_active: true, webinar_count: 2 },
];

export const SEED_SOURCES: WebinarSource[] = [
  { id: 1, name: 'IEEE Computer Society Educational Webinars', code: 'ieee_cs', source_type: 'official_api', base_url: 'https://computer.org/education/webinars', sync_frequency: 'Every 6 hours', status: 'active', last_sync_at: new Date(Date.now() - 7200000).toISOString(), last_sync_status: 'Healthy (200 OK)', records_count: 8, is_active: true },
  { id: 2, name: 'Google Developer Student Clubs Live Feed', code: 'gdsc_feed', source_type: 'feed', base_url: 'https://developers.google.com/community/gdsc/webinars', sync_frequency: 'Every 12 hours', status: 'active', last_sync_at: new Date(Date.now() - 14400000).toISOString(), last_sync_status: 'Healthy (200 OK)', records_count: 6, is_active: true },
  { id: 3, name: 'AWS Educate Student Webinar Series', code: 'aws_educate', source_type: 'official_api', base_url: 'https://aws.amazon.com/education/awseducate/webinars', sync_frequency: 'Daily', status: 'active', last_sync_at: new Date(Date.now() - 28800000).toISOString(), last_sync_status: 'Healthy (200 OK)', records_count: 5, is_active: true },
  { id: 4, name: 'ACM Student Chapters Global Webinar Series', code: 'acm_global', source_type: 'official_api', base_url: 'https://www.acm.org/chapters/students/webinars', sync_frequency: 'Daily', status: 'active', last_sync_at: new Date(Date.now() - 43200000).toISOString(), last_sync_status: 'Healthy (200 OK)', records_count: 3, is_active: true },
  { id: 5, name: 'Verified University & Faculty Imports', code: 'admin_imports', source_type: 'manual_import', base_url: 'https://webinarmatch.org/imports', sync_frequency: 'Manual / On-demand', status: 'idle', last_sync_at: new Date(Date.now() - 86400000).toISOString(), last_sync_status: 'Manual import verified', records_count: 2, is_active: true },
];

// Reference current date: Nov 21, 2026
const NOW_MS = Date.now();
const hour = 3600000;
const day = 86400000;

export const SEED_WEBINARS: Webinar[] = [
  {
    id: 1,
    title: 'Architecting Scalable Microservices on Kubernetes',
    slug: 'architecting-scalable-microservices-kubernetes',
    short_description: 'Learn modern distributed cloud architectures, service mesh configuration, and auto-scaling patterns for student projects.',
    full_description: 'In this technical webinar hosted by IEEE Computer Society, senior software architects explain how to design resilient microservices applications. Topics include containerization best practices, ingress controllers, observability with Prometheus, and zero-downtime deployment strategies. Ideal for computer science students building distributed capstone projects.',
    category_id: 3,
    category_name: 'Cloud Computing & DevOps',
    source_id: 1,
    source_name: 'IEEE Computer Society Educational Webinars',
    external_id: 'IEEE-WB-2026-904',
    start_time: new Date(NOW_MS + 2 * day + 14 * hour).toISOString(),
    end_time: new Date(NOW_MS + 2 * day + 16 * hour).toISOString(),
    timezone: 'UTC+8',
    registration_deadline: new Date(NOW_MS + 2 * day).toISOString(),
    speaker_name: 'Dr. Marcus Vance',
    speaker_title: 'Principal Cloud Architect',
    speaker_organization: 'IEEE Cloud Technical Committee',
    organizer_name: 'IEEE Computer Society',
    webinar_platform: 'Zoom',
    is_free: true,
    certificate_available: true,
    registration_url: 'https://zoom.us/webinar/register/WN_ieee904k8s',
    is_verified: true,
    verification_badge: 'IEEE Verified Academic Webinar',
    status: 'upcoming',
    tags: ['Kubernetes', 'Microservices', 'Cloud', 'Docker', 'IEEE', 'Certificate'],
    eligibility_notes: 'Free for enrolled university undergraduate and postgraduate students.',
    target_audience: 'Computer Science, Software Engineering, and IT majors',
    language: 'English',
    attendance_count: 342,
    created_at: new Date(NOW_MS - 5 * day).toISOString(),
    updated_at: new Date(NOW_MS - 1 * day).toISOString(),
  },
  {
    id: 2,
    title: 'Defensive Security & Threat Hunting: Zero Trust in Practice',
    slug: 'defensive-security-threat-hunting-zero-trust',
    short_description: 'Hands-on webinar covering modern threat intelligence, intrusion detection, and Zero Trust implementation frameworks.',
    full_description: 'Join cybersecurity researcher Elena Rostova for an intensive look into live threat hunting. Participants will learn how modern security operations centers (SOC) analyze telemetry, correlate SIEM alerts, and mitigate advanced persistent threats (APT). Includes live demonstrations of packet inspection and behavioral analysis tools.',
    category_id: 2,
    category_name: 'Cybersecurity & Ethical Hacking',
    source_id: 4,
    source_name: 'ACM Student Chapters Global Webinar Series',
    external_id: 'ACM-CYB-2026-44',
    start_time: new Date(NOW_MS + 3 * day + 10 * hour).toISOString(),
    end_time: new Date(NOW_MS + 3 * day + 12 * hour).toISOString(),
    timezone: 'UTC+8',
    registration_deadline: new Date(NOW_MS + 1 * day + 18 * hour).toISOString(),
    speaker_name: 'Elena Rostova, CISSP',
    speaker_title: 'Senior Cyber Defense Lead',
    speaker_organization: 'ACM Special Interest Group on Security (SIGSAC)',
    organizer_name: 'ACM Student Chapter',
    webinar_platform: 'Microsoft Teams',
    is_free: true,
    certificate_available: true,
    registration_url: 'https://teams.microsoft.com/registration/acm-threat-hunting',
    is_verified: true,
    verification_badge: 'ACM Official Certified Webinar',
    status: 'upcoming',
    tags: ['Cybersecurity', 'Threat Hunting', 'Zero Trust', 'Ethical Hacking', 'SIEM', 'Certificate'],
    eligibility_notes: 'Open to all academic institutions. Certificate issued upon completing the post-webinar assessment.',
    target_audience: 'Cybersecurity, Information Security, and Computer Networks students',
    language: 'English',
    attendance_count: 512,
    created_at: new Date(NOW_MS - 8 * day).toISOString(),
    updated_at: new Date(NOW_MS - 2 * day).toISOString(),
  },
  {
    id: 3,
    title: 'Building Production AI Agents with Retrieval-Augmented Generation (RAG)',
    slug: 'building-production-ai-agents-rag',
    short_description: 'Comprehensive guide to building agentic workflows, vector embeddings, semantic search, and evaluation pipelines.',
    full_description: 'This webinar dives deep into modern GenAI application engineering. We explore chunking strategies, pgvector and semantic vector stores, hybrid search reranking, and multi-agent coordination. Students will see end-to-end demonstrations of integrating LLMs with structured databases.',
    category_id: 1,
    category_name: 'AI & Machine Learning',
    source_id: 2,
    source_name: 'Google Developer Student Clubs Live Feed',
    external_id: 'GDSC-AI-2026-118',
    start_time: new Date(NOW_MS + 4 * day + 15 * hour).toISOString(),
    end_time: new Date(NOW_MS + 4 * day + 17 * hour).toISOString(),
    timezone: 'UTC+8',
    registration_deadline: new Date(NOW_MS + 3 * day).toISOString(),
    speaker_name: 'Kavita Patel',
    speaker_title: 'Google Developer Expert (AI/ML)',
    speaker_organization: 'Google Developer Community',
    organizer_name: 'Google Developer Student Clubs',
    webinar_platform: 'Google Meet',
    is_free: true,
    certificate_available: true,
    registration_url: 'https://meet.google.com/registration/gdsc-ai-rag-2026',
    is_verified: true,
    verification_badge: 'GDSC Verified Official Webinar',
    status: 'upcoming',
    tags: ['Artificial Intelligence', 'RAG', 'LLMs', 'Vector Search', 'Python', 'Google', 'Certificate'],
    eligibility_notes: 'Free registration for student developers. Digital certificate of participation provided.',
    target_audience: 'AI, Data Science, and Computer Engineering students',
    language: 'English',
    attendance_count: 678,
    created_at: new Date(NOW_MS - 4 * day).toISOString(),
    updated_at: new Date(NOW_MS - 1 * day).toISOString(),
  },
  {
    id: 4,
    title: 'Serverless Application Architecture on AWS for University Projects',
    slug: 'serverless-architecture-aws-university-projects',
    short_description: 'Learn how to deploy cost-effective, scalable serverless backends using AWS Lambda, DynamoDB, and API Gateway.',
    full_description: 'Presented by AWS Educate, this webinar teaches students how to build zero-maintenance web application backends. We walk through AWS Lambda execution triggers, infrastructure as code with SAM, serverless authentication with Amazon Cognito, and staying within the AWS Free Tier during academic development.',
    category_id: 3,
    category_name: 'Cloud Computing & DevOps',
    source_id: 3,
    source_name: 'AWS Educate Student Webinar Series',
    external_id: 'AWS-EDU-2026-08',
    start_time: new Date(NOW_MS + 5 * day + 13 * hour).toISOString(),
    end_time: new Date(NOW_MS + 5 * day + 14.5 * hour).toISOString(),
    timezone: 'UTC+8',
    registration_deadline: new Date(NOW_MS + 4 * day).toISOString(),
    speaker_name: 'Julian Sterling',
    speaker_title: 'Senior Solutions Architect, Higher Ed',
    speaker_organization: 'Amazon Web Services',
    organizer_name: 'AWS Educate',
    webinar_platform: 'Zoom',
    is_free: true,
    certificate_available: true,
    registration_url: 'https://aws.amazon.com/webinars/serverless-student-series',
    is_verified: true,
    verification_badge: 'AWS Official Educational Webinar',
    status: 'upcoming',
    tags: ['AWS', 'Serverless', 'Lambda', 'Cloud', 'DynamoDB', 'Certificate'],
    eligibility_notes: 'AWS Educate members receive an automated attendance certificate and cloud credits.',
    target_audience: 'Software Engineering and Cloud Computing undergraduates',
    language: 'English',
    attendance_count: 420,
    created_at: new Date(NOW_MS - 6 * day).toISOString(),
    updated_at: new Date(NOW_MS - 2 * day).toISOString(),
  },
  {
    id: 5,
    title: 'Python for Data Analysis: From Raw Data to Actionable Insights',
    slug: 'python-data-analysis-actionable-insights',
    short_description: 'Master Pandas, NumPy, and Seaborn for university lab assignments and research data processing.',
    full_description: 'Data science educators walk through the entire exploratory data analysis (EDA) pipeline. Learn efficient vectorization, cleaning messy datasets, handling missing values, calculating statistical metrics, and designing publication-ready charts using Python.',
    category_id: 5,
    category_name: 'Data Science & Big Data',
    source_id: 1,
    source_name: 'IEEE Computer Society Educational Webinars',
    external_id: 'IEEE-DS-2026-301',
    start_time: new Date(NOW_MS + 6 * day + 16 * hour).toISOString(),
    end_time: new Date(NOW_MS + 6 * day + 18 * hour).toISOString(),
    timezone: 'UTC+8',
    registration_deadline: new Date(NOW_MS + 5 * day + 12 * hour).toISOString(),
    speaker_name: 'Prof. David Lin',
    speaker_title: 'Chair of Data Science Curriculum',
    speaker_organization: 'IEEE Computational Intelligence Society',
    organizer_name: 'IEEE Computer Society',
    webinar_platform: 'YouTube Live',
    is_free: true,
    certificate_available: false,
    registration_url: 'https://youtube.com/live/ieee-python-data-science',
    is_verified: true,
    verification_badge: 'IEEE Verified Academic Webinar',
    status: 'upcoming',
    tags: ['Python', 'Data Science', 'Pandas', 'Data Analysis', 'IEEE'],
    eligibility_notes: 'Open streaming access on YouTube Live with interactive live chat Q&A.',
    target_audience: 'Data Science, Statistics, and Engineering students',
    language: 'English',
    attendance_count: 290,
    created_at: new Date(NOW_MS - 10 * day).toISOString(),
    updated_at: new Date(NOW_MS - 3 * day).toISOString(),
  },
  {
    id: 6,
    title: 'Full-Stack React & Next.js 15: Server Actions and Modern UI Patterns',
    slug: 'fullstack-react-nextjs-server-actions',
    short_description: 'Explore the newest features of React 19 and Next.js App Router for high-performance student web projects.',
    full_description: 'A deep technical dive into React Server Components, server actions, streaming SSR, and optimistic UI updates. This session is crafted for students aiming to build impressive senior capstone web applications.',
    category_id: 4,
    category_name: 'Web & Mobile Engineering',
    source_id: 2,
    source_name: 'Google Developer Student Clubs Live Feed',
    external_id: 'GDSC-WEB-2026-88',
    start_time: new Date(NOW_MS + 7 * day + 11 * hour).toISOString(),
    end_time: new Date(NOW_MS + 7 * day + 13 * hour).toISOString(),
    timezone: 'UTC+8',
    registration_deadline: new Date(NOW_MS + 6 * day).toISOString(),
    speaker_name: 'Sarah Connor',
    speaker_title: 'Frontend Tech Lead',
    speaker_organization: 'Google Developer Community',
    organizer_name: 'Google Developer Student Clubs',
    webinar_platform: 'Zoom',
    is_free: true,
    certificate_available: true,
    registration_url: 'https://gdsc.community.dev/events/react-nextjs-deepdive',
    is_verified: true,
    verification_badge: 'GDSC Verified Official Webinar',
    status: 'upcoming',
    tags: ['React', 'Next.js', 'Frontend', 'TypeScript', 'Web Development', 'Certificate'],
    eligibility_notes: 'Free registration with student verification.',
    target_audience: 'Web developers, Software Engineering students',
    language: 'English',
    attendance_count: 730,
    created_at: new Date(NOW_MS - 7 * day).toISOString(),
    updated_at: new Date(NOW_MS - 1 * day).toISOString(),
  },
  {
    id: 7,
    title: 'Mastering Technical Interviews: Algorithms, System Design & Live Coding',
    slug: 'mastering-technical-interviews-algorithms-system-design',
    short_description: 'Crucial tips, mock coding sessions, and communication strategies for tech internships and graduate roles.',
    full_description: 'Hiring managers and alumni from top tech companies share actionable methodologies for conquering technical interviews. Topics include whiteboard algorithmic patterns, trade-off analysis during system design rounds, and navigating behavioral questions with the STAR method.',
    category_id: 6,
    category_name: 'Academic & Career Readiness',
    source_id: 4,
    source_name: 'ACM Student Chapters Global Webinar Series',
    external_id: 'ACM-CAR-2026-15',
    start_time: new Date(NOW_MS + 8 * day + 18 * hour).toISOString(),
    end_time: new Date(NOW_MS + 8 * day + 20 * hour).toISOString(),
    timezone: 'UTC+8',
    registration_deadline: new Date(NOW_MS + 7 * day).toISOString(),
    speaker_name: 'Michael Torres',
    speaker_title: 'Staff Software Engineer & Interview Coach',
    speaker_organization: 'ACM Professional Mentorship Council',
    organizer_name: 'ACM Student Chapter',
    webinar_platform: 'Webex',
    is_free: true,
    certificate_available: false,
    registration_url: 'https://acm.webex.com/acm/tech-interview-prep',
    is_verified: true,
    verification_badge: 'ACM Official Certified Webinar',
    status: 'upcoming',
    tags: ['Interview Prep', 'Career', 'Algorithms', 'System Design', 'ACM'],
    eligibility_notes: 'Open to graduating seniors and internship seekers.',
    target_audience: 'College students preparing for tech recruitment',
    language: 'English',
    attendance_count: 850,
    created_at: new Date(NOW_MS - 12 * day).toISOString(),
    updated_at: new Date(NOW_MS - 4 * day).toISOString(),
  },
  {
    id: 8,
    title: 'Computer Vision & Deep Learning with PyTorch for Robotics',
    slug: 'computer-vision-deep-learning-pytorch-robotics',
    short_description: 'Implement YOLO object detection, image segmentation, and edge deployment for autonomous robotic systems.',
    full_description: 'An advanced academic webinar on computer vision architectures. Learn how convolutional backbones and transformer-based vision models (ViT) are adapted for real-time robotic perception and edge computing on embedded hardware.',
    category_id: 1,
    category_name: 'AI & Machine Learning',
    source_id: 1,
    source_name: 'IEEE Computer Society Educational Webinars',
    external_id: 'IEEE-ROB-2026-612',
    start_time: new Date(NOW_MS + 9 * day + 14 * hour).toISOString(),
    end_time: new Date(NOW_MS + 9 * day + 16.5 * hour).toISOString(),
    timezone: 'UTC+8',
    registration_deadline: new Date(NOW_MS + 8 * day).toISOString(),
    speaker_name: 'Dr. Anya Sharma',
    speaker_title: 'Director of Autonomous Perception Lab',
    speaker_organization: 'IEEE Robotics and Automation Society',
    organizer_name: 'IEEE Computer Society',
    webinar_platform: 'Zoom',
    is_free: false,
    price_amount: 15,
    currency: 'USD',
    certificate_available: true,
    registration_url: 'https://ieee.org/webinars/pytorch-robotics-vision',
    is_verified: true,
    verification_badge: 'IEEE Verified Academic Webinar',
    status: 'upcoming',
    tags: ['PyTorch', 'Computer Vision', 'Deep Learning', 'Robotics', 'IEEE', 'Certificate'],
    eligibility_notes: 'Discounted student registration fee ($15). IEEE Student Members attend free with member ID.',
    target_audience: 'Computer Science, Electrical & Computer Engineering students',
    language: 'English',
    attendance_count: 180,
    created_at: new Date(NOW_MS - 14 * day).toISOString(),
    updated_at: new Date(NOW_MS - 5 * day).toISOString(),
  },
  {
    id: 9,
    title: 'Applied Cryptography & Secure Protocol Design',
    slug: 'applied-cryptography-secure-protocol-design',
    short_description: 'Understand public-key cryptography, post-quantum encryption standards, TLS 1.3, and practical key exchange.',
    full_description: 'Cryptographic vulnerabilities frequently compromise otherwise solid web systems. This academic session breaks down elliptic-curve cryptography, constant-time algorithms, and the newly ratified NIST post-quantum cryptographic standards (FIPS 203/204).',
    category_id: 2,
    category_name: 'Cybersecurity & Ethical Hacking',
    source_id: 4,
    source_name: 'ACM Student Chapters Global Webinar Series',
    external_id: 'ACM-CRY-2026-29',
    start_time: new Date(NOW_MS + 10 * day + 9 * hour).toISOString(),
    end_time: new Date(NOW_MS + 10 * day + 11 * hour).toISOString(),
    timezone: 'UTC+8',
    registration_deadline: new Date(NOW_MS + 9 * day).toISOString(),
    speaker_name: 'Prof. Alexander Reed',
    speaker_title: 'Chair of Cryptography Research Group',
    speaker_organization: 'ACM SIGSAC',
    organizer_name: 'ACM Student Chapter',
    webinar_platform: 'Microsoft Teams',
    is_free: true,
    certificate_available: true,
    registration_url: 'https://teams.microsoft.com/registration/acm-cryptography',
    is_verified: true,
    verification_badge: 'ACM Official Certified Webinar',
    status: 'upcoming',
    tags: ['Cryptography', 'Cybersecurity', 'Encryption', 'Security Protocols', 'Certificate'],
    eligibility_notes: 'Free entry for verified students. Certificate provided following attendance verification.',
    target_audience: 'Cybersecurity, Applied Mathematics, and Computer Science students',
    language: 'English',
    attendance_count: 310,
    created_at: new Date(NOW_MS - 15 * day).toISOString(),
    updated_at: new Date(NOW_MS - 4 * day).toISOString(),
  },
  {
    id: 10,
    title: 'Publishing Your First Capstone Paper: From Research to Review',
    slug: 'publishing-first-capstone-paper-research-review',
    short_description: 'Academic paper structuring, literature review methodology, IEEE/ACM formatting, and peer review tips.',
    full_description: 'Transitioning undergraduate research into peer-reviewed conference or journal publications requires adherence to formal academic criteria. This webinar walks students through abstract crafting, experimental reproducibility documentation, and managing peer review revisions.',
    category_id: 6,
    category_name: 'Academic & Career Readiness',
    source_id: 5,
    source_name: 'Verified University & Faculty Imports',
    external_id: 'UNI-RES-2026-03',
    start_time: new Date(NOW_MS + 11 * day + 15 * hour).toISOString(),
    end_time: new Date(NOW_MS + 11 * day + 17 * hour).toISOString(),
    timezone: 'UTC+8',
    registration_deadline: new Date(NOW_MS + 10 * day).toISOString(),
    speaker_name: 'Dr. Rebecca Martinez',
    speaker_title: 'Associate Editor & Senior Faculty Member',
    speaker_organization: 'University Research Council',
    organizer_name: 'Inter-Collegiate Academic Board',
    webinar_platform: 'Zoom',
    is_free: true,
    certificate_available: true,
    registration_url: 'https://zoom.us/webinar/register/WN_research_pub_2026',
    is_verified: true,
    verification_badge: 'Faculty Verified Academic Webinar',
    status: 'upcoming',
    tags: ['Research', 'Academic Publishing', 'Capstone', 'Writing', 'Certificate'],
    eligibility_notes: 'Recommended for undergraduate seniors and graduate students preparing thesis papers.',
    target_audience: 'All STEM and Computing students completing capstone projects',
    language: 'English',
    attendance_count: 460,
    created_at: new Date(NOW_MS - 18 * day).toISOString(),
    updated_at: new Date(NOW_MS - 6 * day).toISOString(),
  },
  // Expired webinar for testing expired detection & historical attendance retention
  {
    id: 11,
    title: 'Historical Archive: Introduction to Git and Open Source for Beginners',
    slug: 'intro-git-open-source-beginners',
    short_description: 'Foundational webinar covering Git branching, rebasing, pull requests, and contributing to open source repositories.',
    full_description: 'This past session taught students foundational version control workflows using Git and GitHub. Archived for student records and historical requirement verification.',
    category_id: 4,
    category_name: 'Web & Mobile Engineering',
    source_id: 2,
    source_name: 'Google Developer Student Clubs Live Feed',
    external_id: 'GDSC-GIT-2026-01',
    start_time: new Date(NOW_MS - 10 * day).toISOString(),
    end_time: new Date(NOW_MS - 10 * day + 2 * hour).toISOString(),
    timezone: 'UTC+8',
    registration_deadline: new Date(NOW_MS - 11 * day).toISOString(),
    speaker_name: 'Leo Zhang',
    speaker_title: 'GDSC Tech Lead',
    speaker_organization: 'Google Developer Community',
    organizer_name: 'Google Developer Student Clubs',
    webinar_platform: 'YouTube Live',
    is_free: true,
    certificate_available: true,
    registration_url: 'https://youtube.com/live/gdsc-git-archive',
    is_verified: true,
    verification_badge: 'GDSC Verified Official Webinar',
    status: 'completed',
    tags: ['Git', 'GitHub', 'Open Source', 'Archived'],
    eligibility_notes: 'Completed session. Recording available for reference.',
    target_audience: 'First and second year computer science students',
    language: 'English',
    attendance_count: 940,
    is_expired: true,
    created_at: new Date(NOW_MS - 25 * day).toISOString(),
    updated_at: new Date(NOW_MS - 10 * day).toISOString(),
  }
];

// Helper to access / persist webinars in localStorage
export const getStoredWebinars = (): Webinar[] => {
  const data = localStorage.getItem('webinarmatch_webinars');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return SEED_WEBINARS;
    }
  }
  localStorage.setItem('webinarmatch_webinars', JSON.stringify(SEED_WEBINARS));
  return SEED_WEBINARS;
};

export const setStoredWebinars = (webinars: Webinar[]) => {
  localStorage.setItem('webinarmatch_webinars', JSON.stringify(webinars));
};

// API Services (Integrated with FastAPI & SQLite database endpoints, with resilient local fallback)
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('webinarmatch_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // 1. Get Categories
  async getCategories(): Promise<WebinarCategory[]> {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend categories fetch failed, using fallback data', e);
    }
    return SEED_CATEGORIES;
  },

  // 2. Get Data Sources
  async getSources(): Promise<WebinarSource[]> {
    try {
      const res = await fetch('/api/sources');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend sources fetch failed, using fallback data', e);
    }
    const stored = localStorage.getItem('webinarmatch_sources');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return SEED_SOURCES; }
    }
    return SEED_SOURCES;
  },

  // 3. Get All Webinars with multi-filter
  async getWebinars(filters?: Partial<SearchFilterState>): Promise<{ webinars: Webinar[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.category_id) params.append('category_id', String(filters.category_id));
      if (filters?.is_free !== undefined) params.append('is_free', String(filters.is_free));
      if (filters?.certificate_available !== undefined) params.append('certificate_available', String(filters.certificate_available));
      if (filters?.webinar_platform) params.append('webinar_platform', filters.webinar_platform);
      if (filters?.start_date) params.append('start_date', filters.start_date);
      if (filters?.end_date) params.append('end_date', filters.end_date);
      if (filters?.deadline_before) params.append('deadline_before', filters.deadline_before);
      if (filters?.include_expired) params.append('include_expired', 'true');
      if (filters?.sort_by) params.append('sort_by', filters.sort_by);
      if (filters?.query && filters.query.trim()) params.append('q', filters.query.trim());

      const res = await fetch(`/api/webinars?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return { webinars: data.webinars, total: data.total };
      }
    } catch (e) {
      console.warn('Backend webinars fetch failed, falling back to local dataset', e);
    }

    // Resilient Local Fallback
    let list = getStoredWebinars();
    const now = new Date();

    list = list.map((w) => {
      const isPast = new Date(w.start_time) < now;
      return {
        ...w,
        is_expired: isPast,
        status: isPast ? 'completed' : w.status,
      };
    });

    if (filters) {
      if (!filters.include_expired) {
        list = list.filter((w) => !w.is_expired);
      }
      if (filters.category_id) {
        list = list.filter((w) => w.category_id === Number(filters.category_id));
      }
      if (filters.is_free !== undefined) {
        list = list.filter((w) => w.is_free === filters.is_free);
      }
      if (filters.certificate_available !== undefined) {
        list = list.filter((w) => w.certificate_available === filters.certificate_available);
      }
      if (filters.webinar_platform) {
        list = list.filter((w) => w.webinar_platform.toLowerCase() === filters.webinar_platform?.toLowerCase());
      }
      if (filters.start_date) {
        const filterStart = new Date(filters.start_date);
        list = list.filter((w) => new Date(w.start_time) >= filterStart);
      }
      if (filters.end_date) {
        const filterEnd = new Date(filters.end_date);
        filterEnd.setHours(23, 59, 59, 999);
        list = list.filter((w) => new Date(w.start_time) <= filterEnd);
      }
      if (filters.deadline_before) {
        const deadlineLimit = new Date(filters.deadline_before);
        list = list.filter((w) => w.registration_deadline && new Date(w.registration_deadline) <= deadlineLimit);
      }
      if (filters.query && filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        list = list.filter((w) => {
          return (
            w.title.toLowerCase().includes(q) ||
            w.short_description.toLowerCase().includes(q) ||
            w.full_description.toLowerCase().includes(q) ||
            w.speaker_name.toLowerCase().includes(q) ||
            w.organizer_name.toLowerCase().includes(q) ||
            w.tags.some((t) => t.toLowerCase().includes(q))
          );
        });
      }
      if (filters.sort_by === 'date_asc') {
        list.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
      } else if (filters.sort_by === 'date_desc') {
        list.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
      } else if (filters.sort_by === 'deadline') {
        list.sort((a, b) => {
          if (!a.registration_deadline) return 1;
          if (!b.registration_deadline) return -1;
          return new Date(a.registration_deadline).getTime() - new Date(b.registration_deadline).getTime();
        });
      }
    }

    return { webinars: list, total: list.length };
  },

  // 4. Get Webinar Details by ID
  async getWebinarById(id: number): Promise<Webinar | null> {
    try {
      const res = await fetch(`/api/webinars/${id}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn(`Backend fetch for webinar #${id} failed, using local fallback`, e);
    }

    const list = getStoredWebinars();
    const found = list.find((w) => w.id === Number(id));
    if (!found) return null;
    const isPast = new Date(found.start_time) < new Date();
    return {
      ...found,
      is_expired: isPast,
      status: isPast ? 'completed' : found.status,
    };
  },

  // 5. AI Semantic Search & Natural Language Query Parser
  async searchWebinarsAI(
    naturalQuery: string,
    additionalFilters?: Partial<SearchFilterState>
  ): Promise<{ webinars: Webinar[]; parsedIntent: ParsedSearchIntent }> {
    try {
      const params = new URLSearchParams();
      params.append('query', naturalQuery);
      if (additionalFilters?.include_expired) {
        params.append('include_expired', 'true');
      }
      const res = await fetch(`/api/webinars/search-ai?${params.toString()}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          webinars: data.webinars,
          parsedIntent: data.parsed_intent || {},
        };
      }
    } catch (e) {
      console.warn('Backend AI search failed, using local semantic fallback', e);
    }

    // Local deterministic NLP Parser fallback
    const list = getStoredWebinars();
    const queryLower = naturalQuery.toLowerCase();
    const parsed: ParsedSearchIntent = {};
    const intentExplanations: string[] = [];

    if (queryLower.includes('free') || queryLower.includes('no cost') || queryLower.includes('without fee')) {
      parsed.extracted_price = 'free';
      intentExplanations.push('Enforcing free registration requirement');
    } else if (queryLower.includes('paid')) {
      parsed.extracted_price = 'paid';
      intentExplanations.push('Filtering for paid / specialized industry webinars');
    }

    if (queryLower.includes('certificate') || queryLower.includes('cert') || queryLower.includes('credential')) {
      parsed.extracted_certificate = true;
      intentExplanations.push('Certificate of completion required');
    }

    const platforms = ['Zoom', 'Google Meet', 'Microsoft Teams', 'Webex', 'YouTube Live'];
    for (const p of platforms) {
      if (queryLower.includes(p.toLowerCase())) {
        parsed.extracted_platform = p;
        intentExplanations.push(`Restricted to ${p} platform`);
        break;
      }
    }

    const concepts: Record<string, string[]> = {
      Cybersecurity: ['protect', 'hacker', 'hacking', 'security', 'zero trust', 'threat', 'defense', 'cyber', 'soc', 'siem', 'penetration', 'firewall'],
      'Artificial Intelligence': ['ai', 'machine learning', 'deep learning', 'neural', 'llm', 'chatgpt', 'rag', 'vision', 'nlp', 'model', 'transformer'],
      'Cloud Computing': ['cloud', 'kubernetes', 'k8s', 'docker', 'aws', 'azure', 'devops', 'serverless', 'microservices', 'container'],
      'Full-Stack Web': ['web', 'react', 'next.js', 'typescript', 'frontend', 'backend', 'fullstack', 'css', 'javascript'],
      'Data Science': ['data', 'analytics', 'big data', 'pandas', 'statistics', 'visualization', 'eda', 'sql'],
      'Career Readiness': ['interview', 'career', 'job', 'internship', 'resume', 'capstone', 'graduation', 'academic'],
    };

    const detectedConcepts: string[] = [];
    for (const [concept, keywords] of Object.entries(concepts)) {
      if (keywords.some((kw) => queryLower.includes(kw))) {
        detectedConcepts.push(concept);
      }
    }
    if (detectedConcepts.length > 0) {
      parsed.extracted_topic = detectedConcepts.join(', ');
      intentExplanations.push(`Concept mapped to domain: ${parsed.extracted_topic}`);
    }

    parsed.interpretation_summary = intentExplanations.length > 0
      ? intentExplanations.join(' • ')
      : `Semantic topic match across title, tags, and description for: "${naturalQuery}"`;

    let filtered = list;
    if (parsed.extracted_price === 'free') {
      filtered = filtered.filter((w) => w.is_free);
    } else if (parsed.extracted_price === 'paid') {
      filtered = filtered.filter((w) => !w.is_free);
    }
    if (parsed.extracted_certificate) {
      filtered = filtered.filter((w) => w.certificate_available);
    }
    if (parsed.extracted_platform) {
      filtered = filtered.filter((w) => w.webinar_platform.toLowerCase() === parsed.extracted_platform?.toLowerCase());
    }

    const scored = filtered.map((w) => {
      let score = 0.40;
      let reason = 'Relevant upcoming academic webinar';
      const wText = `${w.title} ${w.short_description} ${w.full_description} ${w.tags.join(' ')}`.toLowerCase();

      for (const concept of detectedConcepts) {
        const keywords = concepts[concept];
        for (const kw of keywords) {
          if (wText.includes(kw)) {
            score += 0.15;
            reason = `High semantic match for query intent regarding "${kw}" and ${concept}`;
          }
        }
      }

      if (parsed.extracted_certificate && w.certificate_available) {
        score += 0.1;
      }
      if (parsed.extracted_price === 'free' && w.is_free) {
        score += 0.1;
      }

      const clampedScore = Number(Math.min(0.99, score).toFixed(2));
      return {
        ...w,
        similarity_score: clampedScore,
        recommendation_reason: reason,
      };
    });

    scored.sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0));
    return { webinars: scored, parsedIntent: parsed };
  },

  // 6. Explainable AI Recommendations Based on Student Major & Preferences
  async getRecommendations(userInterests?: string[]): Promise<Webinar[]> {
    try {
      const res = await fetch('/api/webinars/recommendations/for-you', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend recommendations failed, using local profile heuristic', e);
    }

    const list = getStoredWebinars().filter((w) => new Date(w.start_time) >= new Date());
    const interests = userInterests && userInterests.length > 0
      ? userInterests
      : ['Artificial Intelligence', 'Cybersecurity', 'Cloud Computing', 'Web Development'];

    return list.map((w) => {
      let matchedReason = '';
      let score = 0.65;
      const matchingInterest = interests.find((interest) =>
        w.tags.some((t) => t.toLowerCase().includes(interest.toLowerCase())) ||
        w.category_name?.toLowerCase().includes(interest.toLowerCase()) ||
        w.title.toLowerCase().includes(interest.toLowerCase())
      );

      if (matchingInterest) {
        score += 0.25;
        matchedReason = `Recommended because your profile highlights interest in ${matchingInterest}`;
      } else if (w.certificate_available && w.is_free) {
        score += 0.15;
        matchedReason = 'Recommended for its high academic student value and free verified certificate';
      } else {
        matchedReason = `Popular upcoming verified webinar in ${w.category_name}`;
      }

      return {
        ...w,
        similarity_score: Number(Math.min(0.98, score).toFixed(2)),
        recommendation_reason: matchedReason,
      };
    }).sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0));
  },

  // 7. Saved Webinars (Bookmarks)
  async getSavedWebinars(): Promise<SavedWebinar[]> {
    try {
      const res = await fetch('/api/saved', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn('Backend saved webinars fetch failed, using local fallback', e);
    }

    const stored = localStorage.getItem('webinarmatch_saved');
    if (stored) {
      try {
        const savedList: SavedWebinar[] = JSON.parse(stored);
        const webinars = getStoredWebinars();
        return savedList.map((s) => {
          const full = webinars.find((w) => w.id === s.webinar_id) || s.webinar;
          return { ...s, webinar: full };
        });
      } catch (e) {
        return [];
      }
    }
    return [];
  },

  async saveWebinar(webinarId: number, notes: string = ''): Promise<boolean> {
    try {
      const params = new URLSearchParams();
      if (notes) params.append('notes', notes);
      const res = await fetch(`/api/saved/${webinarId}?${params.toString()}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.warn('Backend save webinar failed, updating local storage', e);
    }

    const current = await this.getSavedWebinars();
    if (current.some((s) => s.webinar_id === webinarId)) {
      return true;
    }
    const webinar = await this.getWebinarById(webinarId);
    if (!webinar) return false;

    const newSaved: SavedWebinar = {
      id: Date.now(),
      user_id: 1,
      webinar_id: webinarId,
      notes,
      created_at: new Date().toISOString(),
      webinar,
    };
    localStorage.setItem('webinarmatch_saved', JSON.stringify([newSaved, ...current]));
    return true;
  },

  async unsaveWebinar(webinarId: number): Promise<boolean> {
    try {
      const res = await fetch(`/api/saved/${webinarId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.warn('Backend unsave failed, updating local storage', e);
    }

    const current = await this.getSavedWebinars();
    const filtered = current.filter((s) => s.webinar_id !== webinarId);
    localStorage.setItem('webinarmatch_saved', JSON.stringify(filtered));
    return true;
  },

  // 8. Tracked Webinar Registrations
  async getTrackedRegistrations(): Promise<WebinarRegistration[]> {
    try {
      const res = await fetch('/api/registrations', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn('Backend registrations fetch failed, using local fallback', e);
    }

    const stored = localStorage.getItem('webinarmatch_registrations');
    if (stored) {
      try {
        const list: WebinarRegistration[] = JSON.parse(stored);
        const webinars = getStoredWebinars();
        return list.map((r) => {
          const full = webinars.find((w) => w.id === r.webinar_id) || r.webinar;
          return { ...r, webinar: full };
        });
      } catch (e) {
        return [];
      }
    }
    return [];
  },

  async updateRegistrationStatus(webinarId: number, status: RegistrationStatus, notes: string = ''): Promise<boolean> {
    try {
      const res = await fetch(`/api/registrations/${webinarId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.warn('Backend update status failed, saving locally', e);
    }

    const current = await this.getTrackedRegistrations();
    const webinar = await this.getWebinarById(webinarId);
    if (!webinar) return false;

    const existingIndex = current.findIndex((r) => r.webinar_id === webinarId);
    if (existingIndex >= 0) {
      current[existingIndex].status = status;
      current[existingIndex].notes = notes || current[existingIndex].notes;
      current[existingIndex].updated_at = new Date().toISOString();
    } else {
      current.push({
        id: Date.now(),
        user_id: 1,
        webinar_id: webinarId,
        status,
        registered_at: new Date().toISOString(),
        notes,
        updated_at: new Date().toISOString(),
        webinar,
      });
    }
    localStorage.setItem('webinarmatch_registrations', JSON.stringify(current));
    return true;
  },

  // 9. Schedule Conflict Detector
  async checkScheduleConflicts(targetWebinarId: number): Promise<Webinar[]> {
    try {
      const res = await fetch(`/api/calendar/conflicts/${targetWebinarId}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend conflict check failed, checking locally', e);
    }

    const target = await this.getWebinarById(targetWebinarId);
    if (!target) return [];

    const targetStart = new Date(target.start_time).getTime();
    const targetEnd = new Date(target.end_time).getTime();

    const tracked = await this.getTrackedRegistrations();
    const saved = await this.getSavedWebinars();

    const activeIds = new Set([
      ...tracked.filter((t) => t.status === 'registered' || t.status === 'interested').map((t) => t.webinar_id),
      ...saved.map((s) => s.webinar_id),
    ]);

    activeIds.delete(targetWebinarId);

    const allWebinars = getStoredWebinars();
    const conflicts: Webinar[] = [];

    for (const id of activeIds) {
      const other = allWebinars.find((w) => w.id === id);
      if (!other) continue;
      const otherStart = new Date(other.start_time).getTime();
      const otherEnd = new Date(other.end_time).getTime();

      if (targetStart < otherEnd && targetEnd > otherStart) {
        conflicts.push(other);
      }
    }
    return conflicts;
  },

  // 10. Student Reports
  async submitReport(webinarId: number, reportType: string, description: string): Promise<boolean> {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          webinar_id: webinarId,
          report_type: reportType,
          description,
        }),
      });
      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.warn('Backend report submission failed, saving locally', e);
    }

    const stored = localStorage.getItem('webinarmatch_reports');
    const reports: UserReport[] = stored ? JSON.parse(stored) : [];
    const webinar = await this.getWebinarById(webinarId);

    const newReport: UserReport = {
      id: Date.now(),
      user_id: 1,
      webinar_id: webinarId,
      report_type: reportType,
      description,
      status: 'pending',
      created_at: new Date().toISOString(),
      user_name: 'Student User',
      webinar_title: webinar?.title || `Webinar #${webinarId}`,
    };
    reports.unshift(newReport);
    localStorage.setItem('webinarmatch_reports', JSON.stringify(reports));
    return true;
  },

  // 11. Admin Services: Webinar CRUD
  async adminAddWebinar(data: Omit<Webinar, 'id' | 'created_at' | 'updated_at'>): Promise<Webinar> {
    try {
      const res = await fetch('/api/admin/webinars', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend adminAddWebinar failed, saving locally', e);
    }

    const current = getStoredWebinars();
    const newWebinar: Webinar = {
      ...data,
      id: Date.now(),
      slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    current.unshift(newWebinar);
    setStoredWebinars(current);
    return newWebinar;
  },

  async adminUpdateWebinar(id: number, data: Partial<Webinar>): Promise<Webinar | null> {
    try {
      const res = await fetch(`/api/admin/webinars/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend adminUpdateWebinar failed, updating locally', e);
    }

    const current = getStoredWebinars();
    const index = current.findIndex((w) => w.id === id);
    if (index === -1) return null;
    current[index] = {
      ...current[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    setStoredWebinars(current);
    return current[index];
  },

  async adminDeleteWebinar(id: number): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/webinars/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.warn('Backend adminDeleteWebinar failed, deleting locally', e);
    }

    const current = getStoredWebinars();
    const filtered = current.filter((w) => w.id !== id);
    setStoredWebinars(filtered);
    return true;
  },

  // 12. Admin Services: Data Source Synchronization
  async adminTriggerSync(sourceId: number): Promise<SynchronizationLog> {
    try {
      const res = await fetch(`/api/admin/sources/${sourceId}/sync`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend sync failed, triggering local sync simulation', e);
    }

    const sources = await this.getSources();
    const source = sources.find((s) => s.id === sourceId);

    const newLog: SynchronizationLog = {
      id: Date.now(),
      source_id: sourceId,
      source_name: source?.name || `Source #${sourceId}`,
      started_at: new Date(Date.now() - 3500).toISOString(),
      completed_at: new Date().toISOString(),
      status: 'success',
      records_fetched: 8,
      records_added: 2,
      records_updated: 5,
      records_skipped: 1,
    };

    const storedLogs = localStorage.getItem('webinarmatch_sync_logs');
    const logs: SynchronizationLog[] = storedLogs ? JSON.parse(storedLogs) : [];
    logs.unshift(newLog);
    localStorage.setItem('webinarmatch_sync_logs', JSON.stringify(logs));
    return newLog;
  },

  async adminGetSyncLogs(): Promise<SynchronizationLog[]> {
    try {
      const res = await fetch('/api/admin/sync-logs', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend sync logs failed, reading locally', e);
    }

    const stored = localStorage.getItem('webinarmatch_sync_logs');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return []; }
    }
    return [];
  },

  // 13. Admin Services: Student Management
  async adminGetStudents(): Promise<User[]> {
    try {
      const res = await fetch('/api/admin/students', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend admin students failed, reading locally', e);
    }

    const stored = localStorage.getItem('webinarmatch_admin_students');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return []; }
    }
    return [];
  },

  async adminToggleStudentStatus(id: number): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/students/${id}/toggle-status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.warn('Backend toggle status failed, updating locally', e);
    }

    const students = await this.adminGetStudents();
    const s = students.find((item) => item.id === id);
    if (s) {
      s.is_active = !s.is_active;
      localStorage.setItem('webinarmatch_admin_students', JSON.stringify(students));
      return true;
    }
    return false;
  },

  // 14. Admin Reports
  async adminGetReports(): Promise<UserReport[]> {
    try {
      const res = await fetch('/api/admin/reports', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend reports failed, reading locally', e);
    }

    const stored = localStorage.getItem('webinarmatch_reports');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return []; }
    }
    return [];
  },

  async adminResolveReport(id: number, status: 'resolved' | 'dismissed', notes?: string): Promise<boolean> {
    try {
      const params = new URLSearchParams();
      params.append('status', status);
      if (notes) params.append('notes', notes);
      const res = await fetch(`/api/admin/reports/${id}/resolve?${params.toString()}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.warn('Backend resolve report failed, updating locally', e);
    }

    const reports = await this.adminGetReports();
    const r = reports.find((item) => item.id === id);
    if (r) {
      r.status = status;
      if (notes) r.admin_notes = notes;
      localStorage.setItem('webinarmatch_reports', JSON.stringify(reports));
      return true;
    }
    return false;
  },

  // 15. Admin Metrics
  async adminGetMetrics(): Promise<any> {
    try {
      const res = await fetch('/api/admin/metrics', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend admin metrics failed, using fallback', e);
    }

    const webinars = getStoredWebinars();
    const now = new Date();
    return {
      total_students: 5,
      total_webinars: webinars.length,
      upcoming_webinars: webinars.filter((w) => new Date(w.start_time) >= now).length,
      expired_webinars: webinars.filter((w) => new Date(w.start_time) < now).length,
      active_sources: 5,
      pending_reports: 1,
    };
  },

  // 16. Pending Webinar Approval Workflow & Assisted Imports
  async adminGetPendingWebinars(): Promise<Webinar[]> {
    try {
      const res = await fetch('/api/admin/webinars/pending', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend pending webinars failed', e);
    }
    return [];
  },

  async adminApproveWebinar(id: number): Promise<Webinar | null> {
    try {
      const res = await fetch(`/api/admin/webinars/${id}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend approve webinar failed', e);
    }
    return null;
  },

  async adminRejectWebinar(id: number): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/webinars/${id}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.warn('Backend reject webinar failed', e);
    }
    return false;
  },

  async adminPreviewUrl(url: string): Promise<UrlPreviewResponse> {
    const res = await fetch('/api/admin/import/url-preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to inspect webinar URL');
    }
    return await res.json();
  },

  async adminSaveUrlImport(data: any, autoApprove: boolean = false): Promise<Webinar> {
    const res = await fetch(`/api/admin/import/url-save?auto_approve=${autoApprove}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to save imported webinar');
    }
    return await res.json();
  },

  async adminImportCsv(file: File, sourceId: number): Promise<CsvImportSummary> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('webinarmatch_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`/api/admin/import/csv?source_id=${sourceId}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to import CSV file');
    }
    return await res.json();
  },
};
