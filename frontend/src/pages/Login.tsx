import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldAlert, Fingerprint, Activity, Terminal } from 'lucide-react'
import { supabase } from '@/services/supabase'
import aegisLogo from '@/assets/aegis_logo.png'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: sbError } = await supabase.auth.signInWithPassword({ email, password })
      if (sbError) {
        if (sbError.message.includes('Failed to fetch')) {
          localStorage.setItem('aegis_session', JSON.stringify({
            user: { id: 'demo-local', email, role: 'Strategic Intelligence Operative', clearance: 'LEVEL-4 TOP SECRET' },
            access_token: 'demo-token'
          }))
          navigate('/app')
          return
        }
        setError(sbError.message)
        return
      }
      if (data?.session) { navigate('/app'); return }
    } catch {
      localStorage.setItem('aegis_session', JSON.stringify({
        user: { id: 'demo-local', email, role: 'Strategic Intelligence Operative', clearance: 'LEVEL-4 TOP SECRET' },
        access_token: 'demo-token'
      }))
      navigate('/app')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemo = () => {
    localStorage.setItem('aegis_session', JSON.stringify({
      user: { id: 'demo', email: 'director@aegis.gov', role: 'Director', clearance: 'LEVEL-5' },
      access_token: 'demo-token'
    }))
    navigate('/app')
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
          
          <h2 className="aegis-auth-tagline">Secure Uplink<br /><span className="aegis-gold-text">Required.</span></h2>
          <p className="aegis-auth-tagline-sub">
            Authenticate to access live intelligence feeds, deploy autonomous agent swarms, and run adversarial claim validation.
          </p>

          <div className="aegis-auth-features">
            <div className="aegis-auth-feature-item">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <span>End-to-End Encrypted Briefings</span>
            </div>
            <div className="aegis-auth-feature-item">
              <Fingerprint className="w-5 h-5 text-primary" />
              <span>Biometric Identity Verification</span>
            </div>
            <div className="aegis-auth-feature-item">
              <Activity className="w-5 h-5 text-primary" />
              <span>Live Threat Log Monitoring</span>
            </div>
            <div className="aegis-auth-feature-item">
              <Terminal className="w-5 h-5 text-primary" />
              <span>Direct Neo4j Graph Access</span>
            </div>
          </div>
        </div>
      </div>

      <div className="aegis-auth-right">
        <div className="aegis-auth-form-wrap">
          <div className="aegis-auth-form-header">
            <h1>Agent Login</h1>
            <p>Enter your credentials to initiate uplink.</p>
          </div>

          <form onSubmit={handleLogin} className="aegis-auth-form" id="login-form">
            {error && (
              <div className="aegis-auth-error">
                {error}
              </div>
            )}
            
            <div className="aegis-field">
              <label htmlFor="email">Operative Email</label>
              <input
                id="email"
                type="email"
                placeholder="operative@aegis.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="aegis-input"
              />
            </div>
            
            <div className="aegis-field">
              <label htmlFor="password">Passcode</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="aegis-input"
              />
            </div>

            <button type="submit" id="login-submit-btn" disabled={loading} className="aegis-submit-btn">
              {loading ? 'Authenticating...' : 'Establish Uplink'}
            </button>

            <div className="aegis-divider-line mt-4 mb-2">OR</div>

            <button type="button" onClick={handleQuickDemo} className="aegis-quick-btn">
              <Fingerprint className="w-4 h-4" /> Quick Access (Viva Mode)
            </button>

            <p className="aegis-auth-switch mt-6">
              Need operative clearance?{' '}
              <Link to="/signup" className="aegis-auth-switch-link">
                Request Access
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}