// Shared Gemini AI helper for Supabase Edge Functions (Deno — uses fetch, no npm)

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

async function callGemini(prompt: string): Promise<string> {
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) throw new Error('GEMINI_API_KEY not configured')

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
        }),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`Gemini API error: ${err}`)
    }

    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
}

function parseJSON(text: string) {
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(clean)
}

// ── ATS Resume Checker ──────────────────────────────────────────────────────
export async function analyzeResume(resumeText: string, jobRole: string) {
    const prompt = `You are an expert ATS (Applicant Tracking System) and HR analyst.

Analyze the following resume for the job role: "${jobRole}"

Resume Text:
${resumeText}

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "score": <number 0-100>,
  "missingKeywords": [<array of 4-6 important missing keywords/skills as strings>],
  "hrFeedback": "<2-3 sentence expert feedback on the resume quality>",
  "suggestions": [<array of 4-5 specific actionable improvement suggestions as strings>]
}`
    return parseJSON(await callGemini(prompt))
}

// ── Interview Question Generator ────────────────────────────────────────────
export async function generateInterviewQuestions(role: string, experienceLevel: string) {
    const prompt = `You are a senior hiring manager and interview coach.

Generate 6 interview questions for a "${role}" candidate at "${experienceLevel}" level.

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "questions": [
    {
      "q": "<interview question>",
      "a": "<detailed model answer using STAR method where applicable, 3-5 sentences>",
      "type": "<one of: Behavioral, Technical, HR>"
    }
  ]
}

Mix roughly: 2 Behavioral, 2 Technical, 2 HR questions.`
    return parseJSON(await callGemini(prompt))
}

// ── Mock Interview — Single Response ────────────────────────────────────────
export async function mockInterviewRespond(
    conversationHistory: { role: string; text: string }[],
    userAnswer: string,
    questionNumber: number,
    totalQuestions: number
) {
    const isLast = questionNumber >= totalQuestions
    const historyText = conversationHistory
        .map(m => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`)
        .join('\n')

    const prompt = isLast
        ? `You are a professional AI interviewer. The candidate just answered the final question.
Conversation so far:
${historyText}
Candidate's final answer: ${userAnswer}

Give a warm, encouraging closing message (2-3 sentences) saying the interview is complete and you're generating their scorecard.
Respond with plain text only, no JSON.`
        : `You are a professional AI interviewer conducting a job interview.
Conversation so far:
${historyText}
Candidate's answer: ${userAnswer}

Briefly acknowledge their answer positively (1 sentence), then ask the next interview question.
This is question ${questionNumber + 1} of ${totalQuestions}.
Make the question different from any already asked. Keep it concise.
Respond with plain text only, no JSON.`

    const text = await callGemini(prompt)
    return { nextMessage: text, done: isLast }
}

// ── Mock Interview — Final Scorecard ────────────────────────────────────────
export async function generateScorecard(conversationHistory: { role: string; text: string }[]) {
    const historyText = conversationHistory
        .map(m => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`)
        .join('\n')

    const prompt = `You are an expert interview coach. Evaluate this mock interview conversation.

${historyText}

Score the candidate on each dimension from 0-100 based on their actual answers.
Respond ONLY with valid JSON (no markdown):
{
  "clarity": <number>,
  "confidence": <number>,
  "technicalDepth": <number>,
  "overall": <number>,
  "feedback": [<array of 4 specific, personalized feedback points as strings based on their actual answers>]
}`
    return parseJSON(await callGemini(prompt))
}

// ── LinkedIn Profile Optimizer ───────────────────────────────────────────────
export async function optimizeLinkedIn(headline: string, summary: string, targetRole: string) {
    const prompt = `You are a top LinkedIn career coach and recruiter with 15 years of experience.

Current LinkedIn Headline: "${headline}"
Current LinkedIn Summary/About: "${summary}"
Target Role: "${targetRole}"

Rewrite both to be optimized for recruiters hiring for "${targetRole}".
Make the headline punchy, keyword-rich and under 220 characters.
Make the summary professional, 3 paragraphs, with a strong opening hook, key skills, and a call to action.

Respond ONLY with valid JSON (no markdown):
{
  "headline": "<optimized headline>",
  "summary": "<optimized summary with line breaks as \\n>"
}`
    return parseJSON(await callGemini(prompt))
}

// ── Email Generator ──────────────────────────────────────────────────────────
export async function generateEmail(emailType: string, role: string, company: string, tone: string) {
    const typeLabels: Record<string, string> = {
        cold: 'cold job application',
        followup: 'follow-up on a job application',
        referral: 'referral request',
    }
    const label = typeLabels[emailType] || emailType

    const prompt = `You are a professional career coach and expert email writer.

Write a ${label} email for:
- Role: ${role}
- Company: ${company}
- Tone: ${tone}

Write a complete email with subject line. Use [bracketed placeholders] for personal details the user needs to fill in.
Make it compelling, specific and ${tone.toLowerCase()}.
Keep it under 250 words.
Respond with ONLY the email text (subject line first, then body). No JSON, no extra commentary.`

    const email = await callGemini(prompt)
    return { email }
}
