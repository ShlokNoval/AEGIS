import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background pointer-events-none" />
      
      <Card className="w-full max-w-md relative z-10 bg-card/60 backdrop-blur-xl border-border/50 shadow-2xl">
        <CardHeader className="space-y-4 items-center text-center pb-8">
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
                type="email"
                placeholder="Operative Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Clearance Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-background/50"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-md shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Establish Uplink'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
