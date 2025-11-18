import Link from 'next/link'
import './globals.css'

export default function Home() {
  return (
    <div>
      {/* Sticky Navigation */}
      <nav className="sticky-nav">
        <div className="container nav-content">
          <div className="nav-logo">🟢 MYFI</div>
          <div className="nav-links-sticky">
            <Link href="#features">Features</Link>
            <Link href="#how-it-works">How It Works</Link>
            <Link href="/login" className="nav-cta">Get Early Access</Link>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO / TOP FOLD */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-headline">
                MYFI – One App. Every Financial Need.
              </h1>
              <p className="hero-subheadline">
                Track, pay, invest, insure and grow your money — all in one dashboard.
              </p>
              <div className="hero-cta-group">
                <Link href="/register" className="cta-primary-large">
                  Get Early Access
                </Link>
                <Link href="/register" className="cta-secondary-text">
                  Join Waitlist
                </Link>
              </div>
              <div className="trust-badges-row">
                <div className="trust-badge">UPI Partner</div>
                <div className="trust-badge">BSE StarMF</div>
                <div className="trust-badge">MMTC-PAMP</div>
                <div className="trust-badge">CRIF Experian</div>
                <div className="trust-badge">NPCI Verified</div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="mock-phone-large">
                <div className="phone-frame">
                  <div className="phone-screen-content">
                    <div className="app-header">
                      <div className="app-logo-small">MYFI</div>
                      <div className="app-balance">₹12,45,000</div>
                    </div>
                    <div className="app-networth">
                      <div className="networth-label">Net Worth</div>
                      <div className="networth-wheel">📊</div>
                    </div>
                    <div className="app-quick-actions">
                      <button className="app-action">💳 UPI</button>
                      <button className="app-action">📈 Invest</button>
                      <button className="app-action">🪙 Gold</button>
                    </div>
                    <div className="app-gold-balance">
                      <span>Gold: 5.2g</span>
                      <span>Value: ₹33,800</span>
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
          <h2 className="section-title-large">Stop using 8-10 apps to manage your money.</h2>
          <p className="section-subtitle">Switch between payments app, investment app, gold app, credit score, insurance… It&apos;s messy. We simplify it.</p>
          <div className="problem-visual">
            <div className="apps-cluttered">
              <div className="app-icon-small">📱 PhonePe</div>
              <div className="app-icon-small">📈 Groww</div>
              <div className="app-icon-small">💳 CRED</div>
              <div className="app-icon-small">💰 INDmoney</div>
              <div className="app-icon-small">📊 Zerodha</div>
              <div className="app-icon-small">🛡️ PolicyBazaar</div>
              <div className="app-icon-small">🪙 Gold</div>
              <div className="app-icon-small">⭐ Credit</div>
            </div>
            <div className="arrow-large">→</div>
            <div className="myfi-single">
              <div className="myfi-icon-large">🟢 MYFI</div>
              <div className="myfi-tagline">All your finances, one login</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE FEATURES */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Everything you need in one app</h2>
          <div className="features-grid-modern">
            <div className="feature-card-modern">
              <div className="feature-icon-large">💰</div>
              <h3>UPI & Bill Payments</h3>
              <p>Send or receive UPI, pay your bills — no switching apps</p>
            </div>
            <div className="feature-card-modern">
              <div className="feature-icon-large">💳</div>
              <h3>Credit Card Bill Payments & Rewards</h3>
              <p>Pay credit card bills and earn rewards like CRED</p>
            </div>
            <div className="feature-card-modern">
              <div className="feature-icon-large">📈</div>
              <h3>SIP & Mutual Funds</h3>
              <p>Start SIP or invest lumpsum in top mutual funds in minutes</p>
            </div>
            <div className="feature-card-modern">
              <div className="feature-icon-large">🏆</div>
              <h3>Net Worth Dashboard</h3>
              <p>See your complete wealth picture across all accounts</p>
            </div>
            <div className="feature-card-modern">
              <div className="feature-icon-large">🪙</div>
              <h3>Digital & Physical Gold</h3>
              <p>Buy 24K gold digitally or physically, redeem anytime</p>
            </div>
            <div className="feature-card-modern">
              <div className="feature-icon-large">📊</div>
              <h3>Credit Score Tracker</h3>
              <p>Monitor your credit score and get insights to improve it</p>
            </div>
          </div>
          <div className="coming-soon-badge">
            <p>Coming Soon: <span>Stocks</span> • <span>Insurance</span> • <span>Crypto</span></p>
          </div>
        </div>
      </section>

      {/* SECTION 4: USP */}
      <section className="usp-section-full">
        <div className="container">
          <h2 className="usp-title-large">
            MYFI is not just another investing app.<br />
            It&apos;s your <strong>Financial Operating System.</strong>
          </h2>
          <div className="usp-tagline">
            <span>One app</span> • <span>One login</span> • <span>One complete money picture</span>
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <div className="steps-horizontal">
            <div className="step-card-modern">
              <div className="step-number-large">1</div>
              <div className="step-icon">📱</div>
              <h3>Create your MYFI account</h3>
              <p>Phone → OTP → Ready</p>
            </div>
            <div className="step-connector">→</div>
            <div className="step-card-modern">
              <div className="step-number-large">2</div>
              <div className="step-icon">🔗</div>
              <h3>Connect your money</h3>
              <p>UPI, bank, cards, investments</p>
            </div>
            <div className="step-connector">→</div>
            <div className="step-card-modern">
              <div className="step-number-large">3</div>
              <div className="step-icon">🚀</div>
              <h3>Track · Pay · Grow</h3>
              <p>See all your money, invest, save, manage</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: SOCIAL PROOF / TRUST */}
      <section className="social-proof-section">
        <div className="container">
          <h2 className="section-title">Built on trusted financial infrastructure</h2>
          <div className="partner-logos">
            <div className="partner-logo">NPCI</div>
            <div className="partner-logo">BSE</div>
            <div className="partner-logo">MMTC-PAMP</div>
            <div className="partner-logo">CRIF</div>
            <div className="partner-logo">Experian</div>
          </div>
          <div className="proof-stats">
            <p className="proof-text-large">Join our community of early adopters</p>
            <p className="proof-text-small">Early access invites now open</p>
          </div>
        </div>
      </section>

      {/* SECTION 7: SECURITY & COMPLIANCE */}
      <section className="security-section-modern">
        <div className="container">
          <div className="security-header">
            <div className="security-icon-large">🛡️</div>
            <h2 className="section-title">Bank-grade security built in</h2>
          </div>
          <div className="security-grid">
            <div className="security-item-modern">
              <div className="security-check">✓</div>
              <p>PCI-DSS compliant</p>
            </div>
            <div className="security-item-modern">
              <div className="security-check">✓</div>
              <p>256-bit encryption</p>
            </div>
            <div className="security-item-modern">
              <div className="security-check">✓</div>
              <p>We don&apos;t store your passwords</p>
            </div>
            <div className="security-item-modern">
              <div className="security-check">✓</div>
              <p>Your data is safe with us</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: REFERRAL / EARLY ACCESS */}
      <section className="referral-section-modern">
        <div className="container">
          <h2 className="section-title">Invite friends & unlock exclusive rewards</h2>
          <p className="referral-description">Get MYFI Coins → redeem for gold credits, cashback, premium features</p>
          <div className="reward-highlights">
            <div className="reward-highlight">🎁 Earn ₹50 credit per referral</div>
            <div className="reward-highlight">🪙 Bonus gold credits</div>
            <div className="reward-highlight">⭐ Premium features unlock</div>
          </div>
          <Link href="/register" className="cta-primary-large">
            Unlock Early Access
          </Link>
        </div>
      </section>

      {/* SECTION 9: FINAL CTA */}
      <section className="final-cta-section-modern">
        <div className="container">
          <h2 className="final-cta-title-large">
            Take control of your entire financial life.<br />
            With one powerful app.
          </h2>
          <Link href="/register" className="cta-primary-large">
            Get Early Access
          </Link>
        </div>
      </section>

      {/* SECTION 10: FOOTER */}
      <footer className="footer-modern">
        <div className="container">
          <div className="footer-links-modern">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/security">Security</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/careers">Careers</Link>
          </div>
          <div className="footer-social">
            <Link href="#" className="social-icon">LinkedIn</Link>
            <Link href="#" className="social-icon">Twitter</Link>
          </div>
          <div className="footer-copyright-modern">
            <p>© 2025 MYFI Technologies Pvt Ltd</p>
            <p>Domain: www.myfi.club</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
