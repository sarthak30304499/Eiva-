import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, FileText, MessageSquare, Mic, Linkedin, Mail, Star, Shield, Zap, ChevronDown } from 'lucide-react'

const products = [
    { icon: FileText, title: 'ATS Score Checker', desc: 'Get an instant ATS score, identify missing keywords, and land more interviews.', href: '/tools/ats-checker', tag: 'Free', color: '#6c63ff' },
    { icon: MessageSquare, title: 'Interview Q Generator', desc: 'Generate role-specific interview questions with expert model answers.', href: '/tools/interview-questions', tag: 'Free', color: '#00d4ff' },
    { icon: Mic, title: 'Mock Interview Bot', desc: 'Practice with an AI interviewer and get a detailed performance scorecard.', href: '/tools/mock-interview', tag: 'Pro', color: '#ff6584' },
    { icon: Linkedin, title: 'LinkedIn Optimizer', desc: 'Rewrite your headline and summary to attract top recruiters instantly.', href: '/tools/linkedin-optimizer', tag: 'Pro', color: '#00d4ff' },
    { icon: Mail, title: 'Email Generator', desc: 'Craft perfect cold-application, follow-up, and referral emails in seconds.', href: '/tools/email-generator', tag: 'Free', color: '#6c63ff' },
]

const stats = [
    { value: '50K+', label: 'Users' },
    { value: '1.2M+', label: 'Resumes Analyzed' },
    { value: '98%', label: 'Satisfaction' },
    { value: '5 Tools', label: 'In One Platform' },
]

const pricing = [
    { name: 'Free', price: '₹0', period: 'forever', features: ['ATS Score Checker', 'Interview Q Generator', 'Email Generator', '10 analyses/month'], cta: 'Get Started', accent: false },
    { name: 'Pro', price: '₹499', period: 'month', features: ['Everything in Free', 'Mock Interview Bot', 'LinkedIn Optimizer', 'Unlimited analyses', 'Priority support'], cta: 'Start Pro', accent: true },
]

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
}

export default function LandingPage() {
    return (
        <div className="pt-16">
            {/* Hero */}
            <section className="section-padding text-center relative overflow-hidden">
                {/* Decorative orbs */}
                <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-[#7c6fff]/15 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#00e5ff]/10 blur-[120px] pointer-events-none" />
                <div className="absolute top-1/3 right-1/6 w-48 h-48 rounded-full bg-[#ff5fa0]/08 blur-[80px] pointer-events-none" />

                <motion.div {...fadeUp} className="container-xl relative z-10">
                    <span className="badge mb-6">✦ The Career AI Platform</span>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none">
                        Land Your Dream Job<br />
                        <span className="gradient-text">10× Faster</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto mb-10">
                        EIVA AI is a suite of 5 powerful career tools — from ATS-optimized resumes to AI mock interviews — built to give you an unfair advantage.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/products">
                            <button className="btn-primary text-base px-8 py-3">
                                Explore All Tools <ArrowRight size={18} />
                            </button>
                        </Link>
                        <a href="#pricing">
                            <button className="btn-ghost text-base px-8 py-3">View Pricing</button>
                        </a>
                    </div>
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-muted)]"
                >
                    <ChevronDown size={22} />
                </motion.div>
            </section>

            {/* Stats */}
            <section className="py-16 border-y border-[var(--color-border)]">
                <div className="container-xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s, i) => (
                        <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1, duration: 0.4 }} className="text-center">
                            <div className="text-4xl font-black gradient-text mb-1">{s.value}</div>
                            <div className="text-sm text-[var(--color-muted)]">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Products Overview */}
            <section className="section-padding">
                <div className="container-xl px-6">
                    <motion.div {...fadeUp} className="text-center mb-14">
                        <span className="badge mb-4">Products</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white">Everything You Need<br /><span className="gradient-text">to Get Hired</span></h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((p, i) => (
                            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08, duration: 0.4 }}
                                whileHover={{ y: -6, scale: 1.01 }}
                                className="glass-card p-6 group cursor-pointer"
                            >
                                <Link to={p.href}>
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${p.color}22` }}>
                                            <p.icon size={22} style={{ color: p.color }} />
                                        </div>
                                        <span className={p.tag === 'Pro' ? 'tag tag-pro' : 'tag tag-free'}>{p.tag}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--color-accent)] transition-colors">{p.title}</h3>
                                    <p className="text-sm text-[var(--color-muted)] leading-relaxed">{p.desc}</p>
                                    <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                                        Try it now <ArrowRight size={14} />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/products">
                            <button className="btn-ghost gap-2 inline-flex items-center">View All Products <ArrowRight size={16} /></button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="section-padding border-t border-[var(--color-border)]">
                <div className="container-xl px-6">
                    <motion.div {...fadeUp} className="glass-card p-10 md:p-16 text-center">
                        <div className="flex justify-center gap-2 mb-4">
                            {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />)}
                        </div>
                        <p className="text-xl md:text-2xl font-medium text-white max-w-2xl mx-auto mb-6">
                            "EIVA AI helped me increase my interview callback rate from 12% to over 60% in just 3 weeks. It's an absolute game-changer."
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c6fff] to-[#00e5ff] text-white flex items-center justify-center font-bold" style={{ boxShadow: '0 0 16px rgba(124,111,255,0.5)' }}>A</div>
                            <div className="text-left">
                                <div className="font-semibold text-sm text-white">Arjun Mehta</div>
                                <div className="text-xs text-[var(--color-muted)]">Software Engineer @ Google</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Trust badges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        {[
                            { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and never shared. We never train on your resume.' },
                            { icon: Zap, title: 'AI-Powered', desc: 'Backed by the most advanced LLMs. Results in seconds, not hours.' },
                            { icon: Star, title: 'Expert-Validated', desc: 'Built with input from 100+ HR professionals and career coaches.' },
                        ].map((t, i) => (
                            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center">
                                <t.icon size={28} className="text-[var(--color-accent)] mx-auto mb-3" />
                                <h4 className="font-bold text-white mb-2">{t.title}</h4>
                                <p className="text-sm text-[var(--color-muted)]">{t.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="section-padding border-t border-[var(--color-border)]">
                <div className="container-xl px-6">
                    <motion.div {...fadeUp} className="text-center mb-14">
                        <span className="badge mb-4">Pricing</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white">Simple, <span className="gradient-text">Transparent</span> Pricing</h2>
                        <p className="text-[var(--color-muted)] mt-4">No hidden fees. Cancel anytime.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        {pricing.map((plan, i) => (
                            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                                className={`glass-card p-8 relative ${plan.accent ? 'border-[var(--color-accent)]' : ''}`}
                            >
                                {plan.accent && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="badge text-xs">Most Popular</span>
                                    </div>
                                )}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                                    <div className="flex items-end gap-1">
                                        <span className="text-4xl font-black gradient-text">{plan.price}</span>
                                        <span className="text-sm text-[var(--color-muted)] mb-1">/{plan.period}</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
                                            <span className="w-5 h-5 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center text-[var(--color-accent)] text-xs font-bold">✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className={plan.accent ? 'btn-primary w-full justify-center' : 'btn-ghost w-full justify-center'}>
                                    {plan.cta}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="section-padding">
                <div className="container-xl px-6">
                    <motion.div {...fadeUp} className="glass-card p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/10 to-[#00d4ff]/5 pointer-events-none" />
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 relative z-10">
                            Ready to <span className="gradient-text">Accelerate</span> Your Career?
                        </h2>
                        <p className="text-[var(--color-muted)] max-w-xl mx-auto mb-8 relative z-10">
                            Join 50,000+ professionals who use EIVA AI to land better jobs, faster.
                        </p>
                        <Link to="/products">
                            <button className="btn-primary text-base px-10 py-4 relative z-10">
                                Start Free Today <ArrowRight size={18} />
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
