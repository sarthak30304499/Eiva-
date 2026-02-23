import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Target, Loader, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const jobs = ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'Marketing Manager', 'Data Analyst', 'DevOps Engineer', 'Business Analyst']

interface ATSResult {
    score: number
    missingKeywords: string[]
    hrFeedback: string
    suggestions: string[]
}

const ScoreRing = ({ score }: { score: number }) => {
    const color = score >= 80 ? '#00e584' : score >= 60 ? '#00e5ff' : '#ff5fa0'
    const circumference = 2 * Math.PI * 54
    const offset = circumference - (score / 100) * circumference
    return (
        <div className="relative flex items-center justify-center w-36 h-36">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="72" cy="72" r="54" stroke="rgba(124,111,255,0.15)" strokeWidth="10" fill="none" />
                <motion.circle
                    cx="72" cy="72" r="54"
                    stroke={color} strokeWidth="10" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                />
            </svg>
            <div className="relative z-10 text-center">
                <div className="text-3xl font-black" style={{ color }}>{score}</div>
                <div className="text-xs text-[var(--color-muted)] font-medium">/ 100</div>
            </div>
        </div>
    )
}

export default function ATSCheckerPage() {
    const [file, setFile] = useState<File | null>(null)
    const [fileName, setFileName] = useState('')
    const [jobRole, setJobRole] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ATSResult | null>(null)
    const [error, setError] = useState('')

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (f) { setFile(f); setFileName(f.name) }
    }

    const handleAnalyze = async () => {
        if (!file || !jobRole) return
        setLoading(true)
        setResult(null)
        setError('')

        try {
            // Read file as text — works for .txt and most .doc exports
            const resumeText = await file.text()

            const { data, error } = await supabase.functions.invoke('ats-check', {
                body: { resumeText, jobRole },
            })

            if (error) throw new Error(error.message || 'Analysis failed')
            setResult(data)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="pt-24 pb-20">
            <div className="container-xl px-6 max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-[#7c6fff]/20 flex items-center justify-center mx-auto mb-5">
                        <FileText size={30} className="text-[#7c6fff]" />
                    </div>
                    <span className="badge mb-3">Free Tool</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3">ATS Resume <span className="gradient-text">Score Checker</span></h1>
                    <p className="text-[var(--color-muted)] max-w-lg mx-auto">Upload your resume and get an instant AI-powered ATS score, keyword analysis, and actionable feedback to beat the bots.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Upload Resume</label>
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--glass-border)] rounded-xl p-8 cursor-pointer hover:border-[var(--color-accent)] transition-colors group">
                                <Upload size={28} className="text-[var(--color-muted)] group-hover:text-[var(--color-accent)] mb-2 transition-colors" />
                                <span className="text-sm text-[var(--color-muted)] group-hover:text-white transition-colors text-center">
                                    {fileName || 'PDF or DOC • Max 5MB'}
                                </span>
                                <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleFile} />
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Target Job Role</label>
                            <div className="flex items-center gap-2 mb-3">
                                <Target size={16} className="text-[var(--color-accent)]" />
                                <span className="text-sm text-[var(--color-muted)]">Or select from popular roles</span>
                            </div>
                            <input type="text" className="input-glass mb-3" placeholder="e.g. Frontend Developer" value={jobRole} onChange={e => setJobRole(e.target.value)} />
                            <div className="flex flex-wrap gap-2">
                                {jobs.slice(0, 4).map(j => (
                                    <button key={j} onClick={() => setJobRole(j)} className={`text-xs px-3 py-1 rounded-full border transition-all ${jobRole === j ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'border-[var(--glass-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)]/50'}`}>
                                        {j}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {error && <p className="mt-4 text-sm text-[#ff5fa0] bg-[#ff5fa0]/10 rounded-lg px-4 py-2">{error}</p>}

                    <button
                        className="btn-primary w-full justify-center mt-6 text-base py-3"
                        disabled={!file || !jobRole || loading}
                        onClick={handleAnalyze}
                    >
                        {loading ? <><Loader size={16} className="animate-spin" /> Analyzing with AI...</> : 'Analyze My Resume'}
                    </button>
                </motion.div>

                <AnimatePresence>
                    {result && (
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                            <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-8">
                                <ScoreRing score={result.score} />
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {result.score >= 80 ? '🎉 Excellent!' : result.score >= 60 ? '⚡ Good Progress' : '🔧 Needs Work'}
                                    </h2>
                                    <p className="text-[var(--color-muted)] text-sm leading-relaxed">{result.hrFeedback}</p>
                                </div>
                            </div>

                            <div className="glass-card p-6">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><XCircle size={18} className="text-[#ff5fa0]" /> Missing Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingKeywords.map((kw, i) => (
                                        <span key={i} className="px-3 py-1 rounded-lg text-sm bg-[#ff5fa0]/10 text-[#ff5fa0] border border-[#ff5fa0]/30">{kw}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-6">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><AlertCircle size={18} className="text-[#00e5ff]" /> Improvement Suggestions</h3>
                                <ul className="space-y-3">
                                    {result.suggestions.map((s, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-[var(--color-muted)]">
                                            <CheckCircle size={16} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
