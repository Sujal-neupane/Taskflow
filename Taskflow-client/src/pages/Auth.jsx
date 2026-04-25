import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [mode,     setMode]     = useState('signin')   // 'signin' | 'signup'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)       // signup confirm state

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) throw error
        navigate('/dashboard')
      } else {
        const { error, data } = await signUp(email, password)
        if (error) throw error
        if (!data.session) setDone(true)   // email confirmation required
        else navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div className="min-h-screen bg-base flex items-center justify-center p-6">
      <div className="card max-w-sm w-full text-center animate-fade-up">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="font-display font-700 text-xl text-slate-bright mb-2">Check your inbox</h2>
        <p className="text-sm text-slate-soft">We sent a confirmation link to <span className="text-amber font-mono">{email}</span>. Click it to activate your account.</p>
        <button onClick={() => { setDone(false); setMode('signin') }} className="btn-ghost mt-6 w-full justify-center">
          Back to Sign In
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-base flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-surface border-r border-border p-12">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center font-display font-800 text-base text-sm">T</span>
          <span className="font-display font-700 text-xl text-slate-bright">TaskFlow</span>
        </div>

        <div>
          <h1 className="font-display font-800 text-5xl text-slate-bright leading-tight mb-6">
            Build things<br />
            <span className="text-amber">that matter.</span>
          </h1>
          <p className="text-slate-soft text-lg leading-relaxed max-w-sm">
            A clean, focused workspace for teams and solo builders to track projects and ship faster.
          </p>

          {/* Feature list */}
          <ul className="mt-10 space-y-3">
            {['Project & task management', 'Priority tracking', 'Real-time updates', 'Secure JWT auth'].map(f => (
              <li key={f} className="flex items-center gap-3 text-sm text-slate-soft">
                <span className="w-5 h-5 rounded-md bg-amber/10 text-amber flex items-center justify-center text-xs">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-soft/40 font-mono">TaskFlow v1.0 · React + Express + Supabase</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="w-7 h-7 rounded-lg bg-amber flex items-center justify-center font-display font-800 text-sm text-base">T</span>
            <span className="font-display font-700 text-lg text-slate-bright">TaskFlow</span>
          </div>

          <h2 className="font-display font-700 text-2xl text-slate-bright mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm text-slate-soft mb-8">
            {mode === 'signin' ? "Sign in to your workspace." : "Start managing your projects today."}
          </p>

          {/* Toggle */}
          <div className="flex bg-surface border border-border rounded-xl p-1 mb-6">
            {['signin', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-display font-600 transition-all duration-200
                  ${mode === m ? 'bg-card text-amber border border-border shadow-sm' : 'text-slate-soft hover:text-slate-bright'}`}>
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-display font-600 text-slate-soft mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input" placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div>
              <label className="block text-xs font-display font-600 text-slate-soft mb-1.5 uppercase tracking-wider">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="input" placeholder="••••••••" required autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={6} />
            </div>

            {error && (
              <div className="bg-red-task/10 border border-red-task/30 rounded-lg px-4 py-3 text-sm text-red-task animate-fade-up">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center mt-2 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-base/30 border-t-base rounded-full animate-spin" />Working…</span>
                : mode === 'signin' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}