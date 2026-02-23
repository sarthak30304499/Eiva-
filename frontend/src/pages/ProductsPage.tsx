import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileText, MessageSquare, Mic, Linkedin, Mail, ArrowRight } from 'lucide-react'

const products = [
    {
        icon: FileText,
        title: 'ATS Resume Score Checker',
        subtitle: 'Stop getting ghosted by ATS bots.',
        desc: 'Upload your resume, select your target role, and get an instant ATS score (0–100), missing keywords, HR-style feedback, and actionable improvements.',
        href: '/tools/ats-checker',
        tag: 'Free',
        color: '#6c63ff',
        features: ['ATS Score 0–100', 'Missing Keywords', 'HR Feedback', 'Improvement Tips'],
    },
    {
        icon: MessageSquare,
        title: 'Interview Question Generator',
        subtitle: 'Never get caught off-guard again.',
        desc: 'Enter your job role and experience level. Get a curated set of role-specific interview questions with detailed model answers.',
        href: '/tools/interview-questions',
        tag: 'Free',
        color: '#00d4ff',
        features: ['Role-Specific Questions', 'Model Answers', 'Behavioral + Technical', 'Export to PDF'],
    },
    {
        icon: Mic,
        title: 'Mock Interview Chatbot',
        subtitle: 'Practice makes perfect. AI makes it faster.',
        desc: 'A live chat-style AI interview session. The AI asks questions, you answer, and it evaluates your clarity, confidence, and technical depth.',
        href: '/tools/mock-interview',
        tag: 'Pro',
        color: '#ff6584',
        features: ['Live AI Interview', 'Clarity Score', 'Confidence Score', 'Full Scorecard'],
    },
    {
        icon: Linkedin,
        title: 'LinkedIn Profile Optimizer',
        subtitle: 'Make recruiters come to you.',
        desc: 'Paste your current headline and summary. Get an optimized, keyword-rich version tailored to attract your target role.',
        href: '/tools/linkedin-optimizer',
        tag: 'Pro',
        color: '#00d4ff',
        features: ['Headline Rewrite', 'Summary Optimization', 'Recruiter-Friendly Tone', 'Keyword Boost'],
    },
    {
        icon: Mail,
        title: 'Job Application Email Generator',
        subtitle: 'Your cold email, perfected.',
        desc: 'Generate professional cold applications, HR follow-ups, and referral request emails — all in seconds, with an editable tone.',
        href: '/tools/email-generator',
        tag: 'Free',
        color: '#6c63ff',
        features: ['Cold Applications', 'HR Follow-Ups', 'Referral Requests', 'Editable Tone'],
    },
]

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.45 },
}

export default function ProductsPage() {
    return (
        <div className="pt-24 pb-20">
            <div className="container-xl px-6">
                {/* Header */}
                <motion.div {...fadeUp} className="text-center mb-16">
                    <span className="badge mb-4">All Products</span>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                        The Complete<br /><span className="gradient-text">Career AI Suite</span>
                    </h1>
                    <p className="text-lg text-[var(--color-muted)] max-w-xl mx-auto">
                        Five specialized tools designed to give you a competitive edge at every step of the job search.
                    </p>
                </motion.div>

                {/* Product Cards */}
                <div className="space-y-8">
                    {products.map((p, i) => (
                        <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.07, duration: 0.45 }}
                            whileHover={{ scale: 1.005 }}
                            className="glass-card p-8 md:p-10 group"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Icon + Title */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${p.color}20` }}>
                                            <p.icon size={26} style={{ color: p.color }} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h2 className="text-xl font-bold text-white">{p.title}</h2>
                                                <span className={p.tag === 'Pro' ? 'tag tag-pro' : 'tag tag-free'}>{p.tag}</span>
                                            </div>
                                            <p className="text-sm font-medium" style={{ color: p.color }}>{p.subtitle}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-xl">{p.desc}</p>
                                </div>

                                {/* Features + CTA */}
                                <div className="flex flex-col gap-4 min-w-[220px]">
                                    <ul className="space-y-2">
                                        {p.features.map((f, j) => (
                                            <li key={j} className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                                                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: `${p.color}22`, color: p.color }}>✓</span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to={p.href}>
                                        <button className="btn-primary w-full justify-center text-sm">
                                            Launch Tool <ArrowRight size={14} />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
