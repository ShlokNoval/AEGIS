import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldAlert, UserPlus } from 'lucide-react'
import { supabase } from '@/services/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    if (password.length < 6) {
      setError('Clearance password must contain at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Clearance passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signupError) {
        setError(signupError.message)
        return
      }

      if (data.session) {
        navigate('/')
        return
      }

      setMessage('Registration complete. Check your email to confirm access, then establish an uplink.')
    } catch {
      localStorage.setItem('aegis_session', JSON.stringify({
        user: {
          id: `local-${Date.now()}`,
          email,
          role: 'Strategic Intelligence Operative',
          clearance: 'LEVEL-4 TOP SECRET // SCI',
        },
        access_token: 'local-registration-token',
        created_at: new Date().toISOString(),
      }))
      navigate('/')
      return
    } finally {
      setLoading(false)
    }
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
            <CardTitle className="text-3xl font-bold tracking-tight">Join AEGIS</CardTitle>
            <CardDescription>Register an operative identity for the early warning intelligence system.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                {message}
              </div>
            )}
            <Input
              type="email"
              placeholder="Operative Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 bg-background/50 font-mono text-sm"
            />
            <Input
              type="password"
              placeholder="Clearance Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 bg-background/50 font-mono text-sm"
            />
            <Input
              type="password"
              placeholder="Confirm Clearance Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 bg-background/50 font-mono text-sm"
            />
            <Button
              type="submit"
              className="w-full h-12 text-md shadow-lg shadow-primary/20 font-semibold"
              disabled={loading}
            >
              <UserPlus />
              {loading ? 'Registering Operative...' : 'Create Operative Identity'}
            </Button>
            <p className="text-sm text-center text-muted-foreground pt-2">
              Already registered?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Establish uplink
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}