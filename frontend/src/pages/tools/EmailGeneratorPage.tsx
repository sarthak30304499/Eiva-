import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Loader, Copy, CheckCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const emailTypes = [
    { id: 'cold', label: '❄️ Cold Application', desc: 'Apply directly to a company' },
    { id: 'followup', label: '📬 HR Follow-Up', desc: 'Follow up on an application' },
    { id: 'referral', label: '🤝 Referral Request', desc: 'Ask a contact to refer you' },
]
const tones = ['Professional', 'Confident', 'Concise', 'Warm & Personable']

export default function EmailGeneratorPage() {
    const [emailType, setEmailType] = useState('cold')
    const [role, setRole] = useState('')
    const [company, setCompany] = useState('')
    const [tone, setTone] = useState('Professional')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!role || !company) return
        setLoading(true)
        setResult(null)
        setError('')

        try {
            const { data, error } = await supabase.functions.invoke('email-generate', {
                body: { emailType, role, company, tone },
            })
            if (error) throw new Error(error.message || 'Email generation failed')
            setResult(data.email)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Email generation failed. Try again.')
        } finally {
            setLoading(false)
        }
    }

    const copyEmail = async () => {
        if (!result) return
        await navigator.clipboard.writeText(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="pt-24 pb-20">
            <div className="container-xl px-6 max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-[#7c6fff]/20 flex items-center justify-center mx-auto mb-5">
                        <Mail size={30} className="text-[#7c6fff]" />
                    </div>
                    <span className="badge mb-3">Free Tool</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Email <span className="gradient-text">Generator</span></h1>
                    <p className="text-[var(--color-muted)] max-w-md mx-auto">Craft perfect professional emails — cold applications, follow-ups, or referral requests — in seconds with AI.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-8 mb-8 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-white mb-3">Email Type</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {emailTypes.map(t => (
                                <button key={t.id} onClick={() => setEmailType(t.id)} className={`p-4 rounded-xl border text-left transition-all ${emailType === t.id ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'border-[var(--glass-border)] hover:border-[var(--color-accent)]/50'}`}>
                                    <div className="text-sm font-semibold text-white">{t.label}</div>
                                    <div className="text-xs text-[var(--color-muted)] mt-1">{t.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Target Role</label>
                            <input type="text" className="input-glass" placeholder="e.g. Senior Frontend Developer" value={role} onChange={e => setRole(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Company Name</label>
                            <input type="text" className="input-glass" placeholder="e.g. Google" value={company} onChange={e => setCompany(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-white mb-3">Tone</label>
                        <div className="flex flex-wrap gap-2">
                            {tones.map(t => (
                                <button key={t} onClick={() => setTone(t)} className={`text-xs px-4 py-2 rounded-full border transition-all ${tone === t ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'border-[var(--glass-border)] text-[var(--color-muted)]'}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-sm text-[#ff5fa0] bg-[#ff5fa0]/10 rounded-lg px-4 py-2">{error}</p>}

                    <button className="btn-primary w-full justify-center text-base py-3" disabled={!role || !company || loading} onClick={handleGenerate}>
                        {loading ? <><Loader size={16} className="animate-spin" /> Writing with AI...</> : 'Generate Email'}
                    </button>
                </motion.div>

                <AnimatePresence>
                    {result && (
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="glass-card p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-white flex items-center gap-2"><Mail size={16} className="text-[var(--color-accent)]" /> Generated Email</h3>
                                    <button onClick={copyEmail} className="flex items-center gap-1 btn-ghost text-xs py-1 px-3">
                                        {copied ? <><CheckCheck size={13} className="text-green-400" /> Copied!</> : <><Copy size={13} /> Copy</>}
                                    </button>
                                </div>
                                <pre className="text-sm text-[var(--color-muted)] whitespace-pre-wrap leading-relaxed font-sans">{result}</pre>
                            </div>
                            <p className="text-center text-xs text-[var(--color-muted)] mt-4">
                                🔧 Replace all <span className="text-yellow-400">[bracketed]</span> placeholders with your actual information before sending.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
