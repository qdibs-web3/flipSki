// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import { WalletProvider } from './context/WalletProvider';
import { metamaskWallet } from "@thirdweb-dev/react";
import App from './App';
import './styles/index.css';

// Enhanced error boundary with more detailed logging
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("ThirdWeb error caught:", error, errorInfo);
    this.setState({ errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>
          <h2>Something went wrong with ThirdWeb initialization</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Show error details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

// Ensure client ID is properly accessed with fallback
const clientId = typeof import.meta !== 'undefined' && import.meta.env 
  ? import.meta.env.VITE_THIRDWEB_CLIENT_ID 
  : process.env.VITE_THIRDWEB_CLIENT_ID || "";

// Using a direct chain ID instead of importing baseSepoliaChain
const baseSepoliaChainId = ChainId.BaseSepoliaTestnet;

// Only render if we're in the browser
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ThirdwebProvider 
        clientId={clientId}
        activeChain={baseSepoliaChainId}
        supportedWallets={[metamaskWallet()]}
        autoConnect={false}
        // Add these options to improve SSR compatibility
        dAppMeta={{
          name: "FlipSki",
          description: "Blockchain-based coin flip game",
          logoUrl: "",
          url: "",
        }}
      >
        <WalletProvider>
          <Router>
            <App />
          </Router>
        </WalletProvider>
      </ThirdwebProvider>
    </React.StrictMode>,
  );
}
