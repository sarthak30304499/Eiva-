const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const gemini = require('./services/geminiService');
const { verifyToken, getUserPlan, logUsage } = require('./services/supabaseService');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Multer — in-memory file storage for resume uploads (max 5MB)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// ── Auth helper middleware ────────────────────────────────────────────────
async function requireAuth(req, res, next) {
    const user = await verifyToken(req.headers.authorization);
    if (!user) return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    req.user = user;
    next();
}

async function optionalAuth(req, res, next) {
    const user = await verifyToken(req.headers.authorization);
    req.user = user || null;
    next();
}

// ── Health Check ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'EIVA AI Backend', version: '2.0.0' });
});

// ── ATS Resume Checker ───────────────────────────────────────────────────
// Accepts a file upload (PDF/DOC) — reads it as text for now
app.post('/api/ats-check', upload.single('resume'), optionalAuth, async (req, res) => {
    try {
        const { jobRole } = req.body;
        if (!req.file || !jobRole) {
            return res.status(400).json({ error: 'Resume file and job role are required.' });
        }

        // Extract text from the uploaded file buffer
        const resumeText = req.file.buffer.toString('utf-8');

        const result = await gemini.analyzeResume(resumeText, jobRole);

        // Log usage if authenticated
        if (req.user) await logUsage(req.user.id, 'ats-checker');

        res.json(result);
    } catch (err) {
        console.error('ATS check error:', err.message);
        res.status(500).json({ error: 'AI analysis failed. Please try again.' });
    }
});

// ── Interview Question Generator ─────────────────────────────────────────
app.post('/api/interview-questions', optionalAuth, async (req, res) => {
    try {
        const { role, experienceLevel } = req.body;
        if (!role || !experienceLevel) {
            return res.status(400).json({ error: 'Role and experience level are required.' });
        }

        const result = await gemini.generateInterviewQuestions(role, experienceLevel);
        if (req.user) await logUsage(req.user.id, 'interview-questions');

        res.json(result);
    } catch (err) {
        console.error('Interview Q error:', err.message);
        res.status(500).json({ error: 'Failed to generate questions. Please try again.' });
    }
});

// ── Mock Interview — Single Turn ─────────────────────────────────────────
app.post('/api/mock-interview/respond', optionalAuth, async (req, res) => {
    try {
        const { conversationHistory, userAnswer, questionNumber, totalQuestions } = req.body;
        if (!userAnswer) return res.status(400).json({ error: 'Answer is required.' });

        const result = await gemini.mockInterviewRespond(
            conversationHistory || [],
            userAnswer,
            questionNumber || 0,
            totalQuestions || 5
        );
        res.json(result);
    } catch (err) {
        console.error('Mock interview error:', err.message);
        res.status(500).json({ error: 'Interviewer failed to respond. Please try again.' });
    }
});

// ── Mock Interview — Final Scorecard ─────────────────────────────────────
app.post('/api/mock-interview/scorecard', optionalAuth, async (req, res) => {
    try {
        const { conversationHistory } = req.body;
        if (!conversationHistory?.length) {
            return res.status(400).json({ error: 'Conversation history is required.' });
        }

        const result = await gemini.generateScorecard(conversationHistory);
        if (req.user) await logUsage(req.user.id, 'mock-interview');

        res.json(result);
    } catch (err) {
        console.error('Scorecard error:', err.message);
        res.status(500).json({ error: 'Failed to generate scorecard. Please try again.' });
    }
});

// ── LinkedIn Profile Optimizer ────────────────────────────────────────────
app.post('/api/linkedin-optimize', optionalAuth, async (req, res) => {
    try {
        const { headline, summary, targetRole } = req.body;
        if (!headline || !summary || !targetRole) {
            return res.status(400).json({ error: 'Headline, summary, and target role are required.' });
        }

        const result = await gemini.optimizeLinkedIn(headline, summary, targetRole);
        if (req.user) await logUsage(req.user.id, 'linkedin-optimizer');

        res.json(result);
    } catch (err) {
        console.error('LinkedIn optimizer error:', err.message);
        res.status(500).json({ error: 'Optimization failed. Please try again.' });
    }
});

// ── Email Generator ───────────────────────────────────────────────────────
app.post('/api/email-generate', optionalAuth, async (req, res) => {
    try {
        const { emailType, role, company, tone } = req.body;
        if (!role || !company) {
            return res.status(400).json({ error: 'Role and company are required.' });
        }

        const result = await gemini.generateEmail(emailType || 'cold', role, company, tone || 'Professional');
        if (req.user) await logUsage(req.user.id, 'email-generator');

        res.json(result);
    } catch (err) {
        console.error('Email generator error:', err.message);
        res.status(500).json({ error: 'Email generation failed. Please try again.' });
    }
});

// ── Auth — handled client-side via Supabase SDK ────────────────────────
// These endpoints are just for getting user profile/plan info
app.get('/api/me', requireAuth, async (req, res) => {
    try {
        const plan = await getUserPlan(req.user.id);
        res.json({ user: req.user, plan });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user info.' });
    }
});

// ── Start Server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 EIVA AI Backend running at http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
    console.log(`   ✅ Gemini AI: ${process.env.GEMINI_API_KEY ? 'configured' : '⚠️  MISSING KEY'}`);
    console.log(`   ✅ Supabase:  ${process.env.SUPABASE_URL ? 'configured' : '⚠️  MISSING KEY'}\n`);
});
