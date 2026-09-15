export interface TimelineEntry {
  period: string;
  company: string;
  role: string;
  location?: string;
  logo?: string;
  bullets: string[];
}

export interface EducationEntry {
  period: string;
  institution: string;
  degree: string;
  gpa: string;
  location: string;
}

/** Source of truth: Aditya Kamath Resume.pdf (Sept 2026). */
export const EXPERIENCE: TimelineEntry[] = [
  {
    period: 'May 2026 – Present',
    company: 'Rivian',
    role: 'Data Science — Advanced Diagnostic Integration Intern',
    location: 'Illinois, USA',
    bullets: [
      'Reduced vehicle fault investigation time by 70% by building fault-finder, a Python-based Model Context Protocol (MCP) server using FastMCP that automated diagnostics across Jira, GitLab, Databricks, and Google Cloud Firestore.',
      'Improved diagnostic accuracy of AI-assisted fault investigation by designing a persistent memory architecture with 3 collections (cases, corrections, tips), supporting JSON and Databricks Delta Lake storage backends.',
    ],
  },
  {
    period: 'Dec 2024 – Jun 2025',
    company: 'Symmetric IT Services',
    role: 'Senior Machine Learning Engineer',
    location: 'Mumbai, India',
    bullets: [
      'Architected and productionized a client-facing insurance claims copilot using LangGraph, ChromaDB, and FastAPI; integrating RAG retrieval, episodic memory, and tool-based actions with a human-in-the-loop approval layer; containerized with Docker and deployed via CI/CD on GitHub Actions and AWS EC2.',
      'Built 6 n8n automation workflows including a document ingestion and summarization pipeline and a RAG-driven project retrieval system, cutting internal processing time from 3–4 hours to under 10 minutes.',
    ],
  },
  {
    period: 'Aug 2022 – Nov 2024',
    company: 'Quantiphi',
    role: 'Machine Learning Engineer',
    location: 'Mumbai, India',
    logo: '/images/Experience/Quantiphi.png',
    bullets: [
      'Architected a GKE-based, distributed conversational AI platform with 85 routing endpoints, sustaining 10K+ daily users at 99.9% uptime across cloud-native infrastructure.',
      'Trained and fine-tuned a BERT-based sentence transformer (NLP) on 500K domain-specific records and replaced Redis calls with full in-memory caching, cutting inference latency by 62%.',
      'Built a custom topic modeling pipeline using LDA and Top2Vec on 10M+ records, producing 160 topic categories at 88% accuracy, outperforming Google’s native Contact Center AI model in both coverage and precision.',
      'Engineered BigQuery data pipelines (ETL) processing 1M financial records via Cloud Run to power Looker Studio dashboards with automated alerting; reduced issue detection time from 4 days to 5 hours, surfacing a billing error in user segment.',
    ],
  },
];

export const EDUCATION: EducationEntry[] = [
  {
    period: 'Aug 2025 – May 2027 (Expected)',
    institution: 'University of Illinois Urbana-Champaign',
    degree: 'Master of Science in Information Management',
    gpa: '4.0 / 4.0',
    location: 'Champaign, IL',
  },
  {
    period: 'Jul 2018 – Aug 2022',
    institution: 'SVKM’s NMIMS University',
    degree: 'B.Tech. in Electronics and Telecommunication',
    gpa: '3.94 / 4.0',
    location: 'Mumbai, India',
  },
];
