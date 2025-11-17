import Link from 'next/link'
import '../globals.css'

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1E88E5' }}>
          Welcome to MYFI
        </h1>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Phone Number
            </label>
            <input 
              type="tel" 
              placeholder="Enter your phone number"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Password
            </label>
            <input 
              type="password" 
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
          <button 
            type="submit"
            className="cta-button"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Login
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
          Don&apos;t have an account? <Link href="/register" style={{ color: '#1E88E5' }}>Register</Link>
        </p>
        <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#666' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

