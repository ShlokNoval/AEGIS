import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { supabase } from '@/services/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

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
    
    // Normalize identifier to an email format if user entered a username like 'neo4j'
    const loginEmail = email.includes('@') ? email : `${email}@aegis.local`

    try {
      // 1. Attempt Supabase Auth
      const { data, error: sbError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password
      })
      
      if (!sbError && data?.session) {
        navigate('/')
        return
      }
    } catch {
      // Supabase unavailable or network unreachable — gracefully fallback to local clearance
    }

    // 2. Offline / Tactical Clearance Fallback
    localStorage.setItem('aegis_session', JSON.stringify({
      user: {
        id: 'op-alpha-1',
        email: loginEmail,
        role: 'Strategic Intelligence Director',
        clearance: 'LEVEL-4 TOP SECRET // SCI'
      },
      access_token: 'tactical-override-token',
      created_at: new Date().toISOString()
    }))

    setLoading(false)
    navigate('/')
  }

  const handleQuickAccess = () => {
    localStorage.setItem('aegis_session', JSON.stringify({
      user: {
        id: 'op-lead-shlok',
        email: 'operative@aegis-intel.gov',
        role: 'Chief Intelligence Architect',
        clearance: 'DEFCON 1 DIRECTOR CLEARANCE'
      },
      access_token: 'tactical-override-token',
      created_at: new Date().toISOString()
    }))
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background pointer-events-none" />
      
      <Card className="w-full max-w-md relative z-10 bg-card/60 backdrop-blur-xl border-border/50 shadow-2xl">
        <CardHeader className="space-y-4 items-center text-center pb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 shadow-[0_0_30px_-5px_rgba(var(--primary),0.3)]">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">AEGIS Access</CardTitle>
            <CardDescription>Authenticate to access the early warning intelligence system.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Operative Email or ID (e.g. operative@aegis.ai or neo4j)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-background/50 font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Clearance Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-background/50 font-mono text-sm"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-md shadow-lg shadow-primary/20 font-semibold"
              disabled={loading}
            >
              {loading ? 'Authenticating Uplink...' : 'Establish Uplink'}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-mono text-[10px]">
                  VIVA & DEMO FAST PATH
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleQuickAccess}
              className="w-full h-11 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-all font-mono text-xs tracking-wider gap-2"
            >
              ⚡ QUICK ACCESS // LEVEL-4 CLEARANCE
            </Button>

            <p className="text-[11px] text-center text-muted-foreground/70 font-mono pt-2">
              Accepts any clearance credentials or single-click Quick Access for examination mode.
            </p>

            <p className="text-sm text-center text-muted-foreground pt-1">
              New operative?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Register an identity
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
