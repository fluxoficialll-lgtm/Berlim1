import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ReelsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ReelsErrorBoundary pegou um erro:", error, errorInfo);

    // Envia o erro para o servidor
    fetch('/api/errors/log-reels-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: {
          message: error.message,
          stack: error.stack,
        },
        errorInfo: {
          componentStack: errorInfo.componentStack,
        },
      }),
    }).catch(e => console.error("Falha ao enviar log de erro para o servidor:", e));
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.icon}>🎬💥</div>
          <h1 style={styles.title}>Ocorreu um Erro nos Reels</h1>
          <p style={styles.message}>
            Um problema inesperado aconteceu. Nossa equipe já foi notificada.
          </p>
          <p style={styles.details}>Detalhes do erro foram registrados para análise.</p>
          <button 
            style={styles.button}
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100%',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#000',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        padding: '20px',
        textAlign: 'center',
        boxSizing: 'border-box',
    },
    icon: {
        fontSize: '48px',
        marginBottom: '20px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#ff4d4d',
        marginBottom: '10px',
    },
    message: {
        fontSize: '16px',
        color: '#ccc',
        maxWidth: '400px',
        lineHeight: 1.5,
    },
    details: {
        fontSize: '12px',
        color: '#888',
        marginTop: '20px',
    },
    button: {
        marginTop: '30px',
        padding: '12px 25px',
        background: '#00c2ff',
        color: '#000',
        border: 'none',
        borderRadius: '25px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 15px rgba(0, 194, 255, 0.3)',
    },
};

export default ReelsErrorBoundary;
