import { Link } from 'react-router-dom'
import aegisLogo from '@/assets/aegis_logo.png'

const stats = [
  { value: '5', label: 'Specialized AI Agents' },
  { value: '3-Tier', label: 'Source Trust Architecture' },
  { value: 'Real-Time', label: 'Intelligence Synthesis' },
  { value: '82%+', label: 'Avg. Confidence Score' },
]

const capabilities = [
  {
    title: 'Multi-Agent Reconnaissance',
    desc: 'Parallel deployment of specialized Financial, Geopolitical, and Recon operatives that gather and cross-validate intelligence simultaneously.',
    icon: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z',
  },
  {
    title: "Devil's Advocate Auditing",
    desc: 'Every intelligence claim is adversarially stress-tested before certification. Counter-evidence is actively sought to prevent echo chambers.',
    icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
  },
  {
    title: 'Entity Knowledge Graph',
    desc: 'Dynamic relationship mapping of organizations, policies, and geopolitical chokepoints surfaced from your specific query context.',
    icon: 'M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z',
  },
  {
    title: 'Confidence-Weighted Synthesis',
    desc: 'Final briefings are produced using a calibrated scoring formula that weights source tier, agent consensus, and adversarial survival rate.',
    icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  },
]

export function Home() {
  return (
    <div className="aegis-home">
      <div className="aegis-noise" />

      {/* Nav */}
      <header className="aegis-nav">
        <div className="aegis-nav-inner">
          <img src={aegisLogo} alt="AEGIS" className="h-9 w-9 object-contain" />
          <div className="flex flex-col leading-none">
            <span className="aegis-brand">AEGIS</span>
            <span className="aegis-brand-sub">INTELLIGENCE OS</span>
          </div>
          <nav className="ml-auto flex items-center gap-4">
            <Link to="/login" id="home-signin-link" className="aegis-nav-link">Sign In</Link>
            <Link to="/signup" id="home-getaccess-btn" className="aegis-btn-gold">Get Access</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="aegis-hero">
        <div className="aegis-hero-badge">
          <span className="aegis-pulse-dot" /> LIVE INTELLIGENCE SWARM ACTIVE
        </div>
        <img src={aegisLogo} alt="AEGIS Shield" className="aegis-hero-logo" />
        <h1 className="aegis-hero-title">
          Strategic Intelligence,<br />
          <span className="aegis-gold-text">Autonomously Synthesized.</span>
        </h1>
        <p className="aegis-hero-sub">
          AEGIS deploys a coordinated swarm of specialized AI agents to deliver adversarially-vetted,
          confidence-scored intelligence briefings on any geopolitical, financial, or operational query.
        </p>
        <div className="aegis-hero-actions">
          <Link to="/signup" id="hero-request-access" className="aegis-btn-gold-lg">Request Access</Link>
          <Link to="/login" id="hero-signin" className="aegis-btn-outline-lg">Establish Uplink</Link>
        </div>
        <div className="aegis-stats">
          {stats.map((s) => (
            <div key={s.label} className="aegis-stat">
              <span className="aegis-stat-val">{s.value}</span>
              <span className="aegis-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="aegis-divider"><span>SYSTEM CAPABILITIES</span></div>

      {/* Capabilities */}
      <section className="aegis-capabilities">
        <div className="aegis-section-header">
          <h2>Operational Architecture</h2>
          <p>Purpose-built intelligence infrastructure — not a chatbot wrapper.</p>
        </div>
        <div className="aegis-cap-grid">
          {capabilities.map((c) => (
            <div key={c.title} className="aegis-cap-card">
              <div className="aegis-cap-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                </svg>
              </div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="aegis-cta">
        <div className="aegis-cta-inner">
          <img src={aegisLogo} alt="" className="h-14 w-14 object-contain opacity-80" />
          <h2>Begin Your First Intelligence Mission</h2>
          <p>Access requires authentication. Credentials are verified against your registered operative profile.</p>
          <div className="aegis-hero-actions">
            <Link to="/signup" id="cta-create-account" className="aegis-btn-gold-lg">Create Account</Link>
            <Link to="/login" id="cta-signin" className="aegis-btn-outline-lg">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="aegis-footer">
        <img src={aegisLogo} alt="AEGIS" className="h-6 w-6 object-contain opacity-40" />
        <span className="aegis-footer-text">
          © 2026 AEGIS Intelligence OS · MGM University · Shlok Noval & Aditya Londhe
        </span>
      </footer>
    </div>
  )
}
