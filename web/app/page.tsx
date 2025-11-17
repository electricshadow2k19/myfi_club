import Link from 'next/link'
import './globals.css'

export default function Home() {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container header-content">
          <div className="logo">🟢 MYFI</div>
          <nav>
            <ul className="nav-links">
              <li><Link href="#features">Features</Link></li>
              <li><Link href="#about">About</Link></li>
              <li><Link href="/login">Login</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>MYFI – India&apos;s Personal Finance Super App</h1>
          <p>One App. Every Financial Need.</p>
          <Link href="/login" className="cta-button">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
            Everything You Need in One App
          </h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            Manage all your finances from a single, trusted platform
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>UPI Payments</h3>
              <p>Send and receive money instantly via UPI, just like PhonePe and GPay</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Bill Payments</h3>
              <p>Pay electricity, gas, DTH, credit card bills and more in one place</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Net Worth Dashboard</h3>
              <p>Get a complete view of your wealth across all accounts and investments</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Credit Score</h3>
              <p>Track your credit score and get insights to improve it</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Mutual Funds</h3>
              <p>Start SIP or invest lumpsum in mutual funds in just 5 minutes</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🥇</div>
              <h3>Gold</h3>
              <p>Buy and sell digital or physical gold instantly at best prices</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '4rem 0', background: '#f5f5f5' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why MYFI?</h2>
          <p style={{ fontSize: '1.25rem', color: '#666', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
            Stop juggling between 8-10 different finance apps. MYFI brings everything together - 
            payments, investments, wealth tracking, credit management, and more - into one 
            intelligent, gamified, AI-driven platform. Your trusted financial command center.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 MYFI Club. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>
            Domain: www.myfi.club
          </p>
        </div>
      </footer>
    </div>
  )
}

