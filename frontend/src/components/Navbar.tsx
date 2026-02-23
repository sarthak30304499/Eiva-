import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Pricing', href: '/#pricing' },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const location = useLocation()
    const { user, signOut, openAuthModal } = useAuth()

    return (
        <header className="glass-nav fixed top-0 left-0 right-0 z-50">
            <div className="container-xl flex items-center justify-between h-16 px-6">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                    <span className="eiva-rainbow-text font-black">EIVA</span>
                    <span className="text-[var(--color-muted)] font-normal text-sm ml-[-4px]">AI</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map(l => (
                        <Link
                            key={l.href}
                            to={l.href}
                            className={`text-sm font-medium transition-colors ${location.pathname === l.href ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)] hover:text-white'}`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* CTA — logged out */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        // Logged-in state: avatar + email + logout
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-xl">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7c6fff] to-[#00e5ff] flex items-center justify-center">
                                    <User size={12} className="text-white" />
                                </div>
                                <span className="text-xs text-[var(--color-muted)] max-w-[120px] truncate">{user.email}</span>
                            </div>
                            <button
                                onClick={signOut}
                                className="btn-ghost text-sm py-2 px-3 flex items-center gap-1"
                                title="Log out"
                            >
                                <LogOut size={14} /> Log Out
                            </button>
                        </div>
                    ) : (
                        // Logged-out state: Log In + Get Started
                        <>
                            <button
                                className="btn-ghost text-sm py-2 px-4"
                                onClick={() => openAuthModal('login')}
                            >
                                Log In
                            </button>
                            <button
                                className="btn-primary text-sm py-2 px-4"
                                onClick={() => openAuthModal('signup')}
                            >
                                Get Started Free
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button className="md:hidden p-2 text-[var(--color-muted)]" onClick={() => setOpen(!open)}>
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card mx-4 mb-4 p-4 flex flex-col gap-4 md:hidden"
                >
                    {navLinks.map(l => (
                        <Link key={l.href} to={l.href} onClick={() => setOpen(false)}
                            className="text-sm font-medium text-[var(--color-muted)] hover:text-white transition-colors">
                            {l.label}
                        </Link>
                    ))}
                    {user ? (
                        <button onClick={() => { signOut(); setOpen(false) }} className="btn-ghost text-sm w-full justify-center flex items-center gap-2">
                            <LogOut size={14} /> Log Out
                        </button>
                    ) : (
                        <>
                            <button className="btn-ghost text-sm w-full justify-center" onClick={() => { openAuthModal('login'); setOpen(false) }}>Log In</button>
                            <button className="btn-primary text-sm w-full justify-center" onClick={() => { openAuthModal('signup'); setOpen(false) }}>Get Started Free</button>
                        </>
                    )}
                </motion.div>
            )}
        </header>
    )
}
