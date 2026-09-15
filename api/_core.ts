/**
 * Groq-backed chat handler.
 *
 * Written against Web standard APIs (Request/Response/ReadableStream) so the
 * exact same function runs on Vercel's Edge runtime in production and inside a
 * Vite middleware in local dev. Files in api/ that start with "_" are not
 * treated as routes by Vercel.
 *
 * The key never reaches the browser: this executes server-side and reads
 * LLM_API_KEY from the environment.
 */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';

/** Shared generation settings. */
const GEN = {
  temperature: 1,
  top_p: 1,
  reasoning_effort: 'medium',
  stop: null,
};

const FALLBACK_SUGGESTIONS = ['Work experience', 'Technical skills', 'Notable projects'];

/* --------------------------------------------------------------------------
 * Context — what the bot knows. Sourced from Aditya Kamath Resume.pdf (Sept 2026).
 * Edit freely.
 * ----------------------------------------------------------------------- */
const RESUME_CONTEXT = `
Aditya Suresh Kamath — Machine Learning Engineer
Contact: kamath6@illinois.edu | linkedin.com/in/kamath-aditya | github.com/iamadityakamath | kamathaditya.com

SUMMARY
Machine Learning Engineer with 3 years of production experience designing production-grade
Generative AI and agentic AI systems, including a conversational AI platform serving 10K+ daily
users at 99.9% uptime. Experienced in Retrieval-Augmented Generation architectures, multi-agent
orchestration, Model Context Protocol (MCP), and scalable production deployment.

EDUCATION
- University of Illinois Urbana-Champaign, Aug 2025 – May 2027 (Expected).
  MS in Information Management, GPA 4.0/4.0. Champaign, IL.
- SVKM's NMIMS University, Jul 2018 – Aug 2022.
  B.Tech. Electronics and Telecommunication, GPA 3.94/4.0. Mumbai, India.

WORK EXPERIENCE
- Rivian — Data Science, Advanced Diagnostic Integration Intern (May 2026 – Present, Illinois, USA)
  * Reduced vehicle fault investigation time 70% by building fault-finder, a Python MCP server
    using FastMCP automating diagnostics across Jira, GitLab, Databricks, Google Cloud Firestore.
  * Designed a persistent memory architecture with 3 collections (cases, corrections, tips),
    supporting JSON and Databricks Delta Lake storage backends.
- Symmetric IT Services — Senior Machine Learning Engineer (Dec 2024 – Jun 2025, Mumbai, India)
  * Productionized a client-facing insurance claims copilot with LangGraph, ChromaDB, FastAPI;
    RAG retrieval, episodic memory, tool-based actions, human-in-the-loop approval; Docker,
    CI/CD on GitHub Actions, AWS EC2.
  * Built 6 n8n automation workflows; cut internal processing from 3–4 hours to under 10 minutes.
- Quantiphi — Machine Learning Engineer (Aug 2022 – Nov 2024, Mumbai, India)
  * Architected a GKE-based distributed conversational AI platform, 85 routing endpoints,
    10K+ daily users at 99.9% uptime.
  * Fine-tuned a BERT sentence transformer on 500K records; replaced Redis with in-memory
    caching, cutting inference latency 62%.
  * Topic modeling with LDA and Top2Vec on 10M+ records, 160 categories at 88% accuracy.
  * BigQuery ETL on 1M financial records via Cloud Run into Looker Studio; issue detection
    from 4 days to 5 hours.

PROJECTS
- CropSense: multimodal crop disease diagnosis, VGG16 CNN (89% accuracy), RAG retrieval,
  multi-LLM consensus; FastAPI backend, Flutter app, TTS and PDF reports.
- CareCore: 3-agent clinical care plan copilot pulling from Dataverse; drafting time from
  4 hours to under 10 minutes with guardrails and human-in-the-loop approval.
- Model Selector: recommends cost-effective ML models. Flask, BigQuery, Cloud Run, Looker Studio.
- Citi Bike ridership analysis: EDA on 50K samples/year, 2019 vs 2020. Python, Pandas, Tableau.

TECHNICAL SKILLS
Languages: Python, SQL, R
GenAI & LLM: LangChain, LlamaIndex, RAG pipelines, prompt engineering, fine-tuning,
  LLM evaluation, MCP, A2A
Data & Databases: Apache Spark, BigQuery, Airflow, dbt, PostgreSQL, ChromaDB, Pinecone, Supabase
Developer Tools: Docker, Kubernetes, Vertex AI, SageMaker, CI/CD, MLOps, Pytest, Tableau,
  Power BI, Looker Studio
Cloud: Google Cloud Platform, AWS, Microsoft Azure, Databricks
Certifications: GCP Professional Machine Learning Engineer, GCP Professional Cloud Architect

LEADERSHIP
Top 3 Finalist, UIUC Research Park Intern Awards 2026. Tech Lead, Applied Business Research.
`.trim();

const SYSTEM_PROMPT = `You are "Adi", the AI assistant on Aditya Kamath's portfolio site.

Answer questions about Aditya's background, experience, skills, and projects using ONLY the
context below. Speak in first person as Aditya ("I built...", "I worked at..."). Be concise —
two or three short paragraphs at most, and prefer concrete numbers from the context over vague
claims.

If a question isn't covered by the context, say you don't have that detail and point them to
Aditya's email (kamath6@illinois.edu). Never invent employers, dates, metrics, or technologies.

CONTEXT:
${RESUME_CONTEXT}`;

const SUGGESTION_PROMPT = `Propose three short follow-up questions a recruiter or hiring manager
would naturally ask next about Aditya Kamath.

Rules:
- Each is at most 5 words.
- Answerable from a resume covering: Rivian, Symmetric IT Services, Quantiphi, UIUC, MCP servers,
  RAG, GCP certifications, and projects CropSense / CareCore / Model Selector.
- Return ONLY a JSON array of three strings. No prose, no markdown fence.

Example: ["MCP server details", "Rivian internship scope", "GCP certifications"]`;

interface ChatBody {
  question?: string;
  max_tokens?: number;
}

function ndjson(obj: unknown): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(obj) + '\n');
}

async function groqFetch(apiKey: string, body: Record<string, unknown>): Promise<Response> {
  return fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: MODEL, ...GEN, ...body }),
  });
}

/** Asks for follow-ups. Never throws — falls back to a static list. */
async function getSuggestions(apiKey: string, question: string): Promise<string[]> {
  try {
    const res = await groqFetch(apiKey, {
      messages: [
        { role: 'system', content: SUGGESTION_PROMPT },
        { role: 'user', content: question },
      ],
      // gpt-oss spends completion tokens on reasoning before emitting content.
      // At effort "medium" this call burned ~198 of 200 tokens thinking and
      // returned an empty string (finish_reason: "length"). Picking three short
      // follow-ups needs no deliberation, so drop to "low" and leave headroom.
      reasoning_effort: 'low',
      max_completion_tokens: 512,
      stream: false,
    });
    if (!res.ok) return FALLBACK_SUGGESTIONS;

    const data = await res.json();
    let raw: string = data?.choices?.[0]?.message?.content?.trim() ?? '';

    // Models sometimes fence the JSON despite instructions.
    if (raw.startsWith('```')) {
      raw = raw.split('```')[1]?.replace(/^json/i, '').trim() ?? '';
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return FALLBACK_SUGGESTIONS;

    const out = parsed.map((s) => String(s).trim()).filter(Boolean).slice(0, 3);
    return out.length ? out : FALLBACK_SUGGESTIONS;
  } catch {
    return FALLBACK_SUGGESTIONS;
  }
}

export async function handleChat(request: Request, apiKey?: string): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const key = apiKey ?? (globalThis as { process?: { env?: Record<string, string> } }).process?.env?.LLM_API_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: 'LLM_API_KEY is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: ChatBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const question = (body.question ?? '').trim();
  if (!question) {
    return new Response(JSON.stringify({ error: 'Missing "question"' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Kick the suggestions call off now so it overlaps with the main stream
  // instead of adding latency once the answer finishes.
  const suggestionsPromise = getSuggestions(key, question);

  const upstream = await groqFetch(key, {
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: question },
    ],
    max_completion_tokens: Math.min(body.max_tokens ?? 2048, 2048),
    stream: true,
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    console.error('[api/chat] Groq error', upstream.status, detail.slice(0, 500));

    // Still answer in the stream shape so the UI degrades gracefully.
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          ndjson({ content: "I'm having trouble connecting right now. Please try again later." }),
        );
        controller.enqueue(ndjson({ suggestions: await suggestionsPromise }));
        controller.close();
      },
    });
    return new Response(stream, {
      status: 200,
      headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-cache' },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Groq speaks OpenAI-style SSE: "data: {...}\n\n", ending in [DONE].
          let nl: number;
          while ((nl = buffer.indexOf('\n')) !== -1) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);

            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (payload === '[DONE]') continue;

            try {
              const parsed = JSON.parse(payload);
              // gpt-oss is a reasoning model: delta may also carry `reasoning`.
              // Only `content` is meant for the user.
              const token: string = parsed?.choices?.[0]?.delta?.content ?? '';
              if (token) controller.enqueue(ndjson({ content: token }));
            } catch {
              // Partial SSE frame — ignore and wait for more bytes.
            }
          }
        }
      } catch (err) {
        console.error('[api/chat] stream error', err);
        controller.enqueue(ndjson({ content: '\n\n(The response was cut short.)' }));
      }

      controller.enqueue(ndjson({ suggestions: await suggestionsPromise }));
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}
