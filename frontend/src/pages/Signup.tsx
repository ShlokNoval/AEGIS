import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/services/supabase'
import aegisLogo from '@/assets/aegis_logo.png'

export function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null); setError(null)
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const { data, error: signupError } = await supabase.auth.signUp({ email, password })
      if (signupError) { 
        if (signupError.message.includes('Failed to fetch')) {
          // Database is paused/offline - use local Viva session
          localStorage.setItem('aegis_session', JSON.stringify({
            user: { id: `local-${Date.now()}`, email, role: 'Strategic Intelligence Operative', clearance: 'LEVEL-4 TOP SECRET // SCI' },
            access_token: 'local-registration-token',
            created_at: new Date().toISOString(),
          }))
          navigate('/app')
          return
        }
        setError(signupError.message)
        return 
      }
      if (data.session) { navigate('/app'); return }
      setMessage('Account created. Check your email to confirm, then sign in.')
    } catch {
      localStorage.setItem('aegis_session', JSON.stringify({
        user: { id: `local-${Date.now()}`, email, role: 'Strategic Intelligence Operative', clearance: 'LEVEL-4 TOP SECRET // SCI' },
        access_token: 'local-registration-token',
        created_at: new Date().toISOString(),
      }))
      navigate('/app')
    } finally { setLoading(false) }
  }

  return (
    <div className="aegis-auth-page">
      <div className="aegis-noise" />
      <div className="aegis-auth-left">
        <div className="aegis-auth-left-content">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <img src={aegisLogo} alt="AEGIS" className="h-10 w-10 object-contain" />
            <div className="flex flex-col leading-none">
              <span className="aegis-brand">AEGIS</span>
              <span className="aegis-brand-sub">INTELLIGENCE OS</span>
            </div>
          </Link>
          <h2 className="aegis-auth-tagline">Join the<br /><span className="aegis-gold-text">Intelligence Network.</span></h2>
          <p className="aegis-auth-tagline-sub">
            Register an operative profile to access the full AEGIS intelligence stack, including
            autonomous multi-agent briefings and adversarial claim validation.
          </p>
          <div className="aegis-auth-features">
            {["Full access to all 5 specialized AI agents", "Persistent mission history & briefing archive", "Exportable intelligence dossiers in Markdown", "Real-time WebSocket agent monitoring"].map(f => (
              <div key={f} className="aegis-auth-feature-item">
                <span className="aegis-auth-feature-dot" /><span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="aegis-auth-right">
        <div className="aegis-auth-form-wrap">
          <div className="aegis-auth-form-header">
            <h1>Create Account</h1>
            <p>Register to access the AEGIS intelligence system.</p>
          </div>
          <form onSubmit={handleSignup} className="aegis-auth-form" id="signup-form">
            {error && <div className="aegis-auth-error">{error}</div>}
            {message && <div className="aegis-auth-success">{message}</div>}
            <div className="aegis-field">
              <label htmlFor="signup-email">Email Address</label>
              <input id="signup-email" type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required autoComplete="email" className="aegis-input" />
            </div>
            <div className="aegis-field">
              <label htmlFor="signup-password">Password</label>
              <div className="aegis-input-wrap">
                <input id="signup-password" type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                  value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                  autoComplete="new-password" className="aegis-input" />
                <button type="button" onClick={() => setShowPass(p => !p)} className="aegis-input-eye" tabIndex={-1}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="aegis-field">
              <label htmlFor="signup-confirm">Confirm Password</label>
              <input id="signup-confirm" type={showPass ? 'text' : 'password'} placeholder="Repeat password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                minLength={6} autoComplete="new-password" className="aegis-input" />
            </div>
            <button type="submit" id="signup-submit-btn" disabled={loading} className="aegis-submit-btn">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="aegis-auth-switch">
              Already have an account?{' '}
              <Link to="/login" className="aegis-auth-switch-link">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
