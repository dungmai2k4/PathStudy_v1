import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 800, margin: '40px auto', background: '#fff', border: '1px solid #fecaca', borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ color: '#dc2626', fontSize: 20, marginBottom: 12 }}>Đã xảy ra lỗi khi tải giao diện:</h2>
          <pre style={{ background: '#fef2f2', color: '#991b1b', padding: 16, borderRadius: 8, overflowX: 'auto', fontSize: 13, marginBottom: 20, whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
            {this.state.errorInfo?.componentStack}
          </pre>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
            >
              Tải lại trang (F5)
            </button>
            <button
              onClick={() => { window.location.href = '/study-path'; }}
              style={{ padding: '8px 16px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
            >
              Về danh sách lộ trình
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

