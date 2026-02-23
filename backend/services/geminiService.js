// services/geminiService.js
// Wraps Google Gemini API for all EIVA AI tools

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getModel() {
    // gemini-2.0-flash is the current default free-tier model
    return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

// ── ATS Resume Checker ──────────────────────────────────────────────────
async function analyzeResume(resumeText, jobRole) {
    const model = getModel();
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
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // Strip markdown code fences if present
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(clean);
}

// ── Interview Question Generator ────────────────────────────────────────
async function generateInterviewQuestions(role, experienceLevel) {
    const model = getModel();
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

Mix roughly: 2 Behavioral, 2 Technical, 2 HR questions.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(clean);
}

// ── Mock Interview — Single Response ───────────────────────────────────
async function mockInterviewRespond(conversationHistory, userAnswer, questionNumber, totalQuestions) {
    const model = getModel();
    const isLast = questionNumber >= totalQuestions;

    const historyText = conversationHistory
        .map(m => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`)
        .join('\n');

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
Respond with plain text only, no JSON.`;

    const result = await model.generateContent(prompt);
    return {
        nextMessage: result.response.text().trim(),
        done: isLast
    };
}

// ── Mock Interview — Final Scorecard ───────────────────────────────────
async function generateScorecard(conversationHistory) {
    const model = getModel();
    const historyText = conversationHistory
        .map(m => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`)
        .join('\n');

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
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(clean);
}

// ── LinkedIn Profile Optimizer ──────────────────────────────────────────
async function optimizeLinkedIn(headline, summary, targetRole) {
    const model = getModel();
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
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(clean);
}

// ── Email Generator ─────────────────────────────────────────────────────
async function generateEmail(emailType, role, company, tone) {
    const model = getModel();
    const typeLabels = { cold: 'cold job application', followup: 'follow-up on a job application', referral: 'referral request' };
    const label = typeLabels[emailType] || emailType;

    const prompt = `You are a professional career coach and expert email writer.

Write a ${label} email for:
- Role: ${role}
- Company: ${company}
- Tone: ${tone}

Write a complete email with subject line. Use [bracketed placeholders] for personal details the user needs to fill in.
Make it compelling, specific and ${tone.toLowerCase()}.
Keep it under 250 words.
Respond with ONLY the email text (subject line first, then body). No JSON, no extra commentary.`;

    const result = await model.generateContent(prompt);
    return { email: result.response.text().trim() };
}

module.exports = {
    analyzeResume,
    generateInterviewQuestions,
    mockInterviewRespond,
    generateScorecard,
    optimizeLinkedIn,
    generateEmail,
};
