// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
    user: User | null
    session: Session | null
    loading: boolean
    signOut: () => Promise<void>
    openAuthModal: (mode?: 'login' | 'signup') => void
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signOut: async () => { },
    openAuthModal: () => { },
})

export const useAuth = () => useContext(AuthContext)

// We keep a module-level callback so Navbar can trigger the modal
let _openModal: ((mode?: 'login' | 'signup') => void) | null = null
export const triggerAuthModal = (mode: 'login' | 'signup' = 'login') => _openModal?.(mode)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'login' | 'signup'>('login')

    // Register the modal opener
    _openModal = (mode = 'login') => {
        setModalMode(mode)
        setModalOpen(true)
    }

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session)
            setUser(data.session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
            if (session) setModalOpen(false) // Close modal on successful login
        })

        return () => subscription.unsubscribe()
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
        setModalMode(mode)
        setModalOpen(true)
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut, openAuthModal }}>
            {children}
            {modalOpen && (
                <AuthModalInner
                    mode={modalMode}
                    onClose={() => setModalOpen(false)}
                    onSwitch={(m) => setModalMode(m)}
                />
            )}
        </AuthContext.Provider>
    )
}

// ─── Auth Modal ────────────────────────────────────────────────────────────
function AuthModalInner({
    mode,
    onClose,
    onSwitch,
}: {
    mode: 'login' | 'signup'
    onClose: () => void
    onSwitch: (m: 'login' | 'signup') => void
}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handle = async () => {
        if (!email || !password) { setError('Email and password are required.'); return }
        setLoading(true)
        setError('')
        setSuccess('')

        let authError
        if (mode === 'login') {
            const { error: e } = await supabase.auth.signInWithPassword({ email, password })
            authError = e
        } else {
            const { error: e } = await supabase.auth.signUp({ email, password })
            authError = e
            if (!e) setSuccess('Account created! Check your email to verify, then log in.')
        }

        if (authError) setError(authError.message)
        setLoading(false)
    }

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="glass-card w-full max-w-md p-8 relative">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--color-muted)] hover:text-white text-xl leading-none"
                >✕</button>

                {/* Logo */}
                <div className="text-center mb-7">
                    <span className="eiva-rainbow-text font-black text-2xl">EIVA</span>
                    <span className="text-[var(--color-muted)] text-sm ml-1">AI</span>
                    <p className="text-[var(--color-muted)] text-sm mt-1">
                        {mode === 'login' ? 'Welcome back' : 'Create your free account'}
                    </p>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-1 block">Email</label>
                        <input
                            type="email"
                            className="input-glass"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handle()}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-1 block">Password</label>
                        <input
                            type="password"
                            className="input-glass"
                            placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handle()}
                        />
                    </div>

                    {error && <p className="text-sm text-[#ff5fa0] bg-[#ff5fa0]/10 rounded-lg px-4 py-2">{error}</p>}
                    {success && <p className="text-sm text-[#00e584] bg-[#00e584]/10 rounded-lg px-4 py-2">{success}</p>}

                    <button
                        className="btn-primary w-full justify-center text-base py-3 mt-1"
                        onClick={handle}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                {mode === 'login' ? 'Logging in...' : 'Creating account...'}
                            </span>
                        ) : mode === 'login' ? 'Log In' : 'Create Account'}
                    </button>
                </div>

                {/* Toggle */}
                <p className="text-center text-sm text-[var(--color-muted)] mt-5">
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        onClick={() => { setError(''); setSuccess(''); onSwitch(mode === 'login' ? 'signup' : 'login') }}
                        className="text-[var(--color-accent)] hover:underline font-semibold"
                    >
                        {mode === 'login' ? 'Sign up free' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    )
}
