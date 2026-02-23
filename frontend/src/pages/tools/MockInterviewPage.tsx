import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Send, Loader, BarChart2, Award } from 'lucide-react'
import { supabase } from '../../lib/supabase'
const TOTAL_QUESTIONS = 5

type Message = { role: 'ai' | 'user'; text: string }

interface Scorecard {
    clarity: number
    confidence: number
    technicalDepth: number
    overall: number
    feedback: string[]
}

const ScoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
            <span className="text-[var(--color-muted)]">{label}</span>
            <span className="font-bold" style={{ color }}>{value}%</span>
        </div>
        <div className="score-bar">
            <motion.div className="score-bar-fill" style={{ background: `linear-gradient(90deg, ${color}, ${color}aa)` }} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, delay: 0.3 }} />
        </div>
    </div>
)

export default function MockInterviewPage() {
    const [started, setStarted] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [questionNumber, setQuestionNumber] = useState(0)
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [scorecard, setScorecard] = useState<Scorecard | null>(null)
    const [error, setError] = useState('')
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

    const startInterview = () => {
        setStarted(true)
        setQuestionNumber(0)
        setMessages([{
            role: 'ai',
            text: `Hi! I'm your EIVA AI interviewer. I'll ask you ${TOTAL_QUESTIONS} questions. Give honest, detailed answers as if you were in a real interview.\n\nLet's begin — tell me about yourself and your background.`
        }])
    }

    const handleSend = async () => {
        if (!input.trim() || loading) return
        const userMsg = input.trim()
        setInput('')
        const newMessages: Message[] = [...messages, { role: 'user', text: userMsg }]
        setMessages(newMessages)
        setLoading(true)
        setError('')

        try {
            const { data, error } = await supabase.functions.invoke('mock-interview-respond', {
                body: {
                    conversationHistory: newMessages,
                    userAnswer: userMsg,
                    questionNumber,
                    totalQuestions: TOTAL_QUESTIONS,
                },
            })
            if (error) throw new Error(error.message)

            setMessages(prev => [...prev, { role: 'ai', text: data.nextMessage }])
            const nextQ = questionNumber + 1
            setQuestionNumber(nextQ)

            if (data.done) {
                // Fetch scorecard
                await new Promise(r => setTimeout(r, 1000))
                const { data: scData, error: scError } = await supabase.functions.invoke('mock-interview-scorecard', {
                    body: { conversationHistory: [...newMessages, { role: 'ai', text: data.nextMessage }] },
                })
                if (scError) throw new Error('Scorecard generation failed')
                setScorecard(scData)
                setDone(true)
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    const reset = () => { setStarted(false); setDone(false); setMessages([]); setQuestionNumber(0); setScorecard(null); setError('') }

    return (
        <div className="pt-24 pb-20">
            <div className="container-xl px-6 max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#ff5fa0]/20 flex items-center justify-center mx-auto mb-5">
                        <Mic size={30} className="text-[#ff5fa0]" />
                    </div>
                    <span className="badge mb-3" style={{ borderColor: 'rgba(255,95,160,0.4)', background: 'rgba(255,95,160,0.1)', color: '#ff99b0' }}>Pro Tool</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Mock <span className="gradient-text">Interview Bot</span></h1>
                    <p className="text-[var(--color-muted)] max-w-md mx-auto">Practice with an AI interviewer. Answer {TOTAL_QUESTIONS} questions, then get a detailed scorecard on clarity, confidence, and technical depth.</p>
                </motion.div>

                {!started ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-10 text-center">
                        <Award size={50} className="text-[#ff5fa0] mx-auto mb-5" />
                        <h2 className="text-2xl font-bold text-white mb-3">Ready to Interview?</h2>
                        <p className="text-[var(--color-muted)] text-sm mb-6">You'll answer {TOTAL_QUESTIONS} questions. Type your responses as if you're in a real interview. Your answers will be evaluated by AI.</p>
                        <button className="btn-primary mx-auto px-10 py-3 text-base" onClick={startInterview} style={{ background: 'linear-gradient(135deg, #ff5fa0, #ff9966)' }}>
                            Start Interview
                        </button>
                    </motion.div>
                ) : done && scorecard ? (
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="glass-card p-8">
                            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3"><BarChart2 size={24} className="text-[#ff5fa0]" /> Your Scorecard</h2>
                            <p className="text-sm text-[var(--color-muted)] mb-6">Based on your {TOTAL_QUESTIONS} answers — evaluated by AI</p>
                            <ScoreBar label="Clarity & Communication" value={scorecard.clarity} color="#7c6fff" />
                            <ScoreBar label="Confidence & Tone" value={scorecard.confidence} color="#00e5ff" />
                            <ScoreBar label="Technical Depth" value={scorecard.technicalDepth} color="#ff5fa0" />
                            <div className="text-center py-6 border-t border-[var(--glass-border)]">
                                <div className="text-5xl font-black gradient-text mb-1">{scorecard.overall}</div>
                                <div className="text-sm text-[var(--color-muted)]">Overall Score / 100</div>
                            </div>
                        </div>
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-white mb-4">💡 Key Feedback Points</h3>
                            <ul className="space-y-3">
                                {scorecard.feedback.map((f, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-[var(--color-muted)]">
                                        <span className="text-[var(--color-accent)] mt-0.5">→</span>{f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="btn-ghost w-full justify-center" onClick={reset}>Start Over</button>
                    </motion.div>
                ) : (
                    <div className="glass-card overflow-hidden flex flex-col" style={{ height: '60vh' }}>
                        {/* Progress */}
                        <div className="px-5 pt-3 pb-2 border-b border-[var(--glass-border)] flex items-center justify-between">
                            <span className="text-xs text-[var(--color-muted)]">Question {Math.min(questionNumber + 1, TOTAL_QUESTIONS)} of {TOTAL_QUESTIONS}</span>
                            <div className="flex gap-1">
                                {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                                    <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i < questionNumber ? 'bg-[#7c6fff]' : 'bg-[var(--glass-border)]'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            <AnimatePresence initial={false}>
                                {messages.map((m, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'bg-gradient-to-br from-[#7c6fff] to-[#00e5ff] text-white' : 'glass-card text-[var(--color-text)]'}`}>
                                            {m.role === 'ai' && <span className="text-[10px] text-[var(--color-accent)] font-bold uppercase tracking-wider block mb-1">EIVA AI Interviewer</span>}
                                            {m.text}
                                        </div>
                                    </motion.div>
                                ))}
                                {loading && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                        <div className="glass-card px-4 py-3 rounded-2xl flex gap-2 items-center">
                                            <Loader size={14} className="animate-spin text-[var(--color-accent)]" />
                                            <span className="text-xs text-[var(--color-muted)]">Thinking...</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div ref={bottomRef} />
                        </div>
                        {error && <p className="mx-4 text-xs text-[#ff5fa0] bg-[#ff5fa0]/10 rounded px-3 py-1">{error}</p>}
                        <div className="p-4 border-t border-[var(--glass-border)] flex gap-3">
                            <input className="input-glass flex-1" placeholder="Type your answer..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                            <button className="btn-primary px-4 py-2" onClick={handleSend} disabled={loading}><Send size={16} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
