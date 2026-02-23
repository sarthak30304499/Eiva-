import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Loader, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const experienceLevels = ['Fresher (0-1 yr)', 'Junior (1-3 yr)', 'Mid-level (3-6 yr)', 'Senior (6+ yr)']
const commonRoles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'Business Analyst']

interface Question { q: string; a: string; type: string }

export default function InterviewQGenPage() {
    const [role, setRole] = useState('')
    const [level, setLevel] = useState('')
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState<Question[] | null>(null)
    const [expanded, setExpanded] = useState<number | null>(null)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!role || !level) return
        setLoading(true)
        setQuestions(null)
        setError('')

        try {
            const { data, error } = await supabase.functions.invoke('interview-questions', {
                body: { role, experienceLevel: level },
            })
            if (error) throw new Error(error.message || 'Failed to generate')
            setQuestions(data.questions)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to generate. Try again.')
        } finally {
            setLoading(false)
        }
    }

    const typeColor = (type: string) => ({ Behavioral: '#7c6fff', Technical: '#00e5ff', HR: '#ff5fa0' }[type] || '#7c6fff')

    return (
        <div className="pt-24 pb-20">
            <div className="container-xl px-6 max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-[#00e5ff]/20 flex items-center justify-center mx-auto mb-5">
                        <MessageSquare size={30} className="text-[#00e5ff]" />
                    </div>
                    <span className="badge mb-3">Free Tool</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Interview Question <span className="gradient-text">Generator</span></h1>
                    <p className="text-[var(--color-muted)] max-w-md mx-auto">Get curated, role-specific interview questions with expert AI model answers, tailored to your experience level.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Job Role</label>
                            <input type="text" className="input-glass mb-3" placeholder="e.g. Software Engineer" value={role} onChange={e => setRole(e.target.value)} />
                            <div className="flex flex-wrap gap-2">
                                {commonRoles.slice(0, 3).map(r => (
                                    <button key={r} onClick={() => setRole(r)} className={`text-xs px-3 py-1 rounded-full border transition-all ${role === r ? 'border-[#00e5ff] text-[#00e5ff] bg-[#00e5ff]/10' : 'border-[var(--glass-border)] text-[var(--color-muted)] hover:border-[#00e5ff]/50'}`}>{r}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Experience Level</label>
                            <div className="grid grid-cols-2 gap-2">
                                {experienceLevels.map(l => (
                                    <button key={l} onClick={() => setLevel(l)} className={`text-xs px-3 py-2 rounded-lg border transition-all text-left ${level === l ? 'border-[#00e5ff] text-[#00e5ff] bg-[#00e5ff]/10' : 'border-[var(--glass-border)] text-[var(--color-muted)] hover:border-[#00e5ff]/50'}`}>{l}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {error && <p className="mt-4 text-sm text-[#ff5fa0] bg-[#ff5fa0]/10 rounded-lg px-4 py-2">{error}</p>}
                    <button className="btn-primary w-full justify-center mt-6 text-base py-3" disabled={!role || !level || loading} onClick={handleGenerate}>
                        {loading ? <><Loader size={16} className="animate-spin" /> Generating with AI...</> : 'Generate Questions'}
                    </button>
                </motion.div>

                <AnimatePresence>
                    {questions && (
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <p className="text-sm text-[var(--color-muted)] font-medium">Showing {questions.length} questions for <span className="text-white">{role}</span> · <span className="text-white">{level}</span></p>
                            {questions.map((item, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="glass-card p-5 cursor-pointer" onClick={() => setExpanded(expanded === i ? null : i)}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${typeColor(item.type)}20`, color: typeColor(item.type) }}>{item.type}</span>
                                                <span className="text-xs text-[var(--color-muted)]">Q{i + 1}</span>
                                            </div>
                                            <p className="text-sm font-medium text-white">{item.q}</p>
                                        </div>
                                        {expanded === i ? <ChevronUp size={16} className="text-[var(--color-muted)] flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-[var(--color-muted)] flex-shrink-0 mt-1" />}
                                    </div>
                                    <AnimatePresence>
                                        {expanded === i && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                                                    <p className="text-xs font-semibold text-[var(--color-accent)] mb-2 uppercase tracking-wide">Model Answer</p>
                                                    <p className="text-sm text-[var(--color-muted)] leading-relaxed">{item.a}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
