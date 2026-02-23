import { Link } from 'react-router-dom'
import { Zap, Twitter, Github, Linkedin, Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-[var(--color-border)] bg-[rgba(5,5,16,0.8)] mt-20">
            <div className="container-xl px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 font-bold text-xl mb-3">
                            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c6fff] to-[#00e5ff] flex items-center justify-center" style={{ boxShadow: '0 0 14px rgba(124,111,255,0.55)' }}>
                                <Zap size={16} className="text-white" />
                            </span>
                            <span className="eiva-rainbow-text font-black">EIVA AI</span>
                        </div>
                        <p className="text-sm text-[var(--color-muted)] max-w-xs leading-relaxed">
                            Your all-in-one AI-powered career acceleration platform. From resumes to interviews — we've got you covered.
                        </p>
                        <div className="flex gap-4 mt-5">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 glass-card flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Products</h4>
                        <ul className="space-y-2">
                            {[
                                { label: 'ATS Score Checker', href: '/tools/ats-checker' },
                                { label: 'Interview Questions', href: '/tools/interview-questions' },
                                { label: 'Mock Interview', href: '/tools/mock-interview' },
                                { label: 'LinkedIn Optimizer', href: '/tools/linkedin-optimizer' },
                                { label: 'Email Generator', href: '/tools/email-generator' },
                            ].map(l => (
                                <li key={l.href}>
                                    <Link to={l.href} className="text-sm text-[var(--color-muted)] hover:text-white transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2">
                            {['About', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service'].map(l => (
                                <li key={l}>
                                    <a href="#" className="text-sm text-[var(--color-muted)] hover:text-white transition-colors">{l}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[var(--color-border)] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-[var(--color-muted)]">
                        © {new Date().getFullYear()} EIVA AI. All rights reserved.
                    </p>
                    <p className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                        Built with <Heart size={12} className="text-[var(--color-accent-3)]" /> for ambitious professionals
                    </p>
                </div>
            </div>
        </footer>
    )
}
