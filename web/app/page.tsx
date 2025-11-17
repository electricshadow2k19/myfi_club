import Link from 'next/link'
import './globals.css'

export default function Home() {
  return (
    <div>
      {/* SECTION 1: HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-headline">
                MYFI – One App. Every Financial Need.
              </h1>
              <p className="hero-subheadline">
                Track, pay, invest, insure, and grow your money — all in ONE dashboard.
              </p>
              <div className="hero-cta">
                <Link href="/register" className="cta-primary">
                  Get Early Access
                </Link>
                <Link href="/login" className="cta-secondary">
                  Join Waitlist
                </Link>
              </div>
              <div className="trust-badges">
                <span>UPI</span>
                <span>BSE StarMF</span>
                <span>MMTC-PAMP</span>
                <span>CRIF Experian</span>
                <span>NPCI Verified Partner</span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="mock-phone">
                <div className="phone-screen">
                  <div className="screen-content">
                    <div className="net-worth-card">
                      <div className="net-worth-label">Net Worth</div>
                      <div className="net-worth-value">₹12,45,000</div>
                    </div>
                    <div className="quick-actions">
                      <button className="action-btn">💳 UPI</button>
                      <button className="action-btn">📈 Invest</button>
                      <button className="action-btn">🪙 Gold</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PROBLEM STATEMENT */}
      <section className="problem-section">
        <div className="container">
          <h2 className="section-title">Stop using 10 apps for your money.</h2>
          <div className="apps-grid">
            <div className="app-item">
              <div className="app-icon">📱</div>
              <div className="app-name">PhonePe</div>
              <div className="app-purpose">UPI</div>
            </div>
            <div className="app-item">
              <div className="app-icon">📈</div>
              <div className="app-name">Groww</div>
              <div className="app-purpose">MF</div>
            </div>
            <div className="app-item">
              <div className="app-icon">💳</div>
              <div className="app-name">CRED</div>
              <div className="app-purpose">Credit Cards</div>
            </div>
            <div className="app-item">
              <div className="app-icon">💰</div>
              <div className="app-name">INDmoney</div>
              <div className="app-purpose">Net Worth</div>
            </div>
            <div className="app-item">
              <div className="app-icon">📊</div>
              <div className="app-name">Zerodha</div>
              <div className="app-purpose">Stocks</div>
            </div>
            <div className="app-item">
              <div className="app-icon">🛡️</div>
              <div className="app-name">PolicyBazaar</div>
              <div className="app-purpose">Insurance</div>
            </div>
          </div>
          <div className="myfi-replaces">
            <div className="arrow">➡️</div>
            <div className="myfi-badge">MYFI replaces all</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE FEATURES */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Everything you need in one app</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Credit Card Bill Pay</h3>
              <p>Pay & earn rewards like CRED</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>UPI & Bill Payments</h3>
              <p>One tap payments, no switching apps</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>SIP & Mutual Funds</h3>
              <p>Invest in top funds in 2 minutes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Net Worth Dashboard</h3>
              <p>See your total wealth in one screen</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🪙</div>
              <h3>Digital & Physical Gold</h3>
              <p>Buy 24K gold, redeem anytime</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Credit Score Tracker</h3>
              <p>Monitor and improve instantly</p>
            </div>
          </div>
          <div className="coming-soon">
            <p>Coming soon: <span>Stocks</span> • <span>Insurance</span> • <span>Crypto</span> (Optional)</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: USP / DIFFERENTIATOR */}
      <section className="usp-section">
        <div className="container">
          <h2 className="usp-title">MYFI is not another investing app.</h2>
          <p className="usp-subtitle">It is a <strong>Financial Operating System</strong> for your life.</p>
          <div className="usp-points">
            <div className="usp-point">🔥 One login</div>
            <div className="usp-point">🔥 One dashboard</div>
            <div className="usp-point">🔥 One complete wealth picture</div>
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">①</div>
              <h3>Create your MYFI account</h3>
              <p>Phone → OTP → Ready to go</p>
            </div>
            <div className="step-card">
              <div className="step-number">②</div>
              <h3>Connect your finances</h3>
              <p>UPI, banks, MFs, credit cards, gold, investments</p>
            </div>
            <div className="step-card">
              <div className="step-number">③</div>
              <h3>Track • Pay • Grow</h3>
              <p>All your money, one intelligent platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: SOCIAL PROOF */}
      <section className="social-proof-section">
        <div className="container">
          <div className="proof-content">
            <p className="proof-text">Backed by industry-grade financial infrastructure</p>
            {/* Future: Replace with actual metrics */}
            {/* <div className="proof-stats">
              <div className="stat">⭐ 50,000+ users trust MYFI</div>
              <div className="stat">⭐ ₹12 Cr net worth tracked</div>
              <div className="stat">⭐ 4.8★ app rating</div>
            </div> */}
          </div>
        </div>
      </section>

      {/* SECTION 7: SECURITY */}
      <section className="security-section">
        <div className="container">
          <h2 className="section-title">🛡️ Security matters. MYFI is built to banking standards.</h2>
          <div className="security-features">
            <div className="security-item">
              <div className="security-icon">✔</div>
              <p>PCI DSS compliant</p>
            </div>
            <div className="security-item">
              <div className="security-icon">✔</div>
              <p>Bank-grade 256-bit encryption</p>
            </div>
            <div className="security-item">
              <div className="security-icon">✔</div>
              <p>API-connected directly to partner banks</p>
            </div>
            <div className="security-item">
              <div className="security-icon">✔</div>
              <p>We do NOT store your passwords</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: REFERRAL / EARLY ACCESS */}
      <section className="referral-section">
        <div className="container">
          <h2 className="section-title">Invite friends & unlock exclusive rewards</h2>
          <p className="referral-text">For every user who joins, get:</p>
          <div className="rewards-grid">
            <div className="reward-item">✔ Free credit score refresh</div>
            <div className="reward-item">✔ Bonus gold credits</div>
            <div className="reward-item">✔ ₹50 wallet credit (optional)</div>
          </div>
          <Link href="/register" className="cta-primary">
            Start Referring
          </Link>
        </div>
      </section>

      {/* SECTION 9: FINAL CTA */}
      <section className="final-cta-section">
        <div className="container">
          <h2 className="final-cta-title">Take control of your entire financial life.</h2>
          <p className="final-cta-subtitle">With one app.</p>
          <Link href="/register" className="cta-primary large">
            JOIN EARLY ACCESS
          </Link>
        </div>
      </section>

      {/* SECTION 10: FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-links">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/security">Security</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/careers">Careers</Link>
            </div>
            <div className="footer-copyright">
              <p>© 2025 MYFI Technologies Pvt Ltd</p>
              <p>Domain: www.myfi.club</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
