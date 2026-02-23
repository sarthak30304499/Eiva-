import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Linkedin, Loader, Copy, CheckCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase'
const targetRoles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'Marketing Lead', 'DevOps Engineer']

interface OptResult { headline: string; summary: string }

export default function LinkedInOptimizerPage() {
    const [headline, setHeadline] = useState('')
    const [summary, setSummary] = useState('')
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<OptResult | null>(null)
    const [copied, setCopied] = useState<'headline' | 'summary' | null>(null)
    const [error, setError] = useState('')

    const handleOptimize = async () => {
        if (!headline || !summary || !role) return
        setLoading(true)
        setResult(null)
        setError('')

        try {
            const { data, error } = await supabase.functions.invoke('linkedin-optimize', {
                body: { headline, summary, targetRole: role },
            })
            if (error) throw new Error(error.message || 'Optimization failed')
            setResult(data)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Optimization failed. Try again.')
        } finally {
            setLoading(false)
        }
    }

    const copy = async (field: 'headline' | 'summary') => {
        if (!result) return
        await navigator.clipboard.writeText(field === 'headline' ? result.headline : result.summary)
        setCopied(field)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div className="pt-24 pb-20">
            <div className="container-xl px-6 max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-[#00e5ff]/20 flex items-center justify-center mx-auto mb-5">
                        <Linkedin size={30} className="text-[#00e5ff]" />
                    </div>
                    <span className="badge mb-3" style={{ borderColor: 'rgba(255,95,160,0.4)', background: 'rgba(255,95,160,0.1)', color: '#ff99b0' }}>Pro Tool</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3">LinkedIn <span className="gradient-text">Profile Optimizer</span></h1>
                    <p className="text-[var(--color-muted)] max-w-md mx-auto">Paste your current profile and target role. Get an AI-rewritten headline and summary that attract recruiters.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-8 mb-8 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">Current Headline</label>
                        <input type="text" className="input-glass" placeholder="e.g. Software Developer at XYZ Corp" value={headline} onChange={e => setHeadline(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">Current Summary / About</label>
                        <textarea className="input-glass resize-none" rows={5} placeholder="Paste your current LinkedIn About section..." value={summary} onChange={e => setSummary(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">Target Role</label>
                        <input type="text" className="input-glass mb-3" placeholder="e.g. Senior Product Manager" value={role} onChange={e => setRole(e.target.value)} />
                        <div className="flex flex-wrap gap-2">
                            {targetRoles.slice(0, 4).map(r => (
                                <button key={r} onClick={() => setRole(r)} className={`text-xs px-3 py-1 rounded-full border transition-all ${role === r ? 'border-[#00e5ff] text-[#00e5ff] bg-[#00e5ff]/10' : 'border-[var(--glass-border)] text-[var(--color-muted)]'}`}>{r}</button>
                            ))}
                        </div>
                    </div>
                    {error && <p className="text-sm text-[#ff5fa0] bg-[#ff5fa0]/10 rounded-lg px-4 py-2">{error}</p>}
                    <button className="btn-primary w-full justify-center text-base py-3" disabled={!headline || !summary || !role || loading} onClick={handleOptimize}>
                        {loading ? <><Loader size={16} className="animate-spin" /> Optimizing with AI...</> : 'Optimize My Profile'}
                    </button>
                </motion.div>

                <AnimatePresence>
                    {result && (
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">✦ Optimized Headline</h3>
                                    <button onClick={() => copy('headline')} className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                                        {copied === 'headline' ? <><CheckCheck size={14} className="text-green-400" /> Copied!</> : <><Copy size={14} /> Copy</>}
                                    </button>
                                </div>
                                <p className="text-white font-medium">{result.headline}</p>
                            </div>
                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">✦ Optimized Summary</h3>
                                    <button onClick={() => copy('summary')} className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                                        {copied === 'summary' ? <><CheckCheck size={14} className="text-green-400" /> Copied!</> : <><Copy size={14} /> Copy</>}
                                    </button>
                                </div>
                                <p className="text-sm text-[var(--color-muted)] leading-relaxed whitespace-pre-line">{result.summary}</p>
                            </div>
                            <div className="glass-card p-4 text-center text-sm text-[var(--color-muted)]">
                                💡 <strong className="text-white">Pro tip:</strong> Copy each section and paste directly into LinkedIn. Update your Skills section with the keywords mentioned.
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
