import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '2px solid #f5222d',
          borderRadius: '8px',
          backgroundColor: '#fff1f0',
          color: '#f5222d'
        }}>
          <h2>Oops! Something went wrong</h2>
          <details style={{ marginTop: '10px', cursor: 'pointer' }}>
            <summary>Error details</summary>
            <pre style={{ marginTop: '10px', overflow: 'auto', backgroundColor: '#fff', padding: '10px' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={this.resetError}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              backgroundColor: '#f5222d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
