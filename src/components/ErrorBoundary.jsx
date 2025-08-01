import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Production Error Caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid #00ff88',
            maxWidth: '500px'
          }}>
            <div style={{ fontSize: '3em', marginBottom: '20px' }}>🔧</div>
            <h1 style={{ color: '#00ff88', marginBottom: '20px' }}>SecureX</h1>
            <h2 style={{ marginBottom: '20px' }}>System Maintenance</h2>
            <p style={{ marginBottom: '30px', lineHeight: '1.6' }}>
              We're experiencing a temporary issue. The platform is being optimized for better performance.
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: '#00ff88',
                color: '#000',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🔄 Refresh Application
            </button>
            <p style={{ fontSize: '12px', marginTop: '20px', opacity: '0.7' }}>
              If the issue persists, please contact support
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
