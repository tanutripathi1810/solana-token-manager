import { useState } from 'react';
import { SolanaProvider } from './providers/WalletProvider';
import { WalletProvider } from './contexts/WalletContext';
import { TokenProvider } from './contexts/TokenContext';
import { WalletButton } from './components/WalletButton';
import { TokenCreator } from './components/TokenCreator';
import { TokenMinter } from './components/TokenMinter';
import { TokenSender } from './components/TokenSender';
import { BalanceDisplay } from './components/BalanceDisplay';
import { TransactionHistory } from './components/TransactionHistory';
import '@solana/wallet-adapter-react-ui/styles.css';
import './styles/wallet-adapter.css';

// Modern dark theme color palette
const theme = {
  background: {
    primary: '#13111C',
    secondary: '#1A1625',
    accent: '#252134'
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B8B5C0',
    accent: '#8A87ED'
  },
  accent: {
    primary: '#8A87ED', // Purple
    secondary: '#625AF3', // Deeper purple
    tertiary: '#3F3D56', // Dark purple/slate
    success: '#50E3C2', // Teal for success indicators
    warning: '#F7D070' // Gold for warnings
  }
};

const features = [
  { name: 'Create Token', component: <TokenCreator /> },
  { name: 'Mint Token', component: <TokenMinter /> },
  { name: 'Send Token', component: <TokenSender /> },
  { name: 'View Balance', component: <BalanceDisplay /> },
  { name: 'Transaction History', component: <TransactionHistory /> }
];

function App() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <SolanaProvider>
      <WalletProvider>
        <TokenProvider>
          <div style={{ 
            minHeight: '100vh', 
            background: `linear-gradient(150deg, ${theme.background.primary} 0%, ${theme.background.secondary} 100%)`,
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            padding: '0',
            marginLeft: '-2rem',
            marginRight: '-2rem',
            marginTop: '-2rem',
            paddingTop: '7rem',
            paddingBottom: '5.5rem',
            boxSizing: 'border-box',
            overflowX: 'hidden', // Added to prevent horizontal scrolling
            position: 'relative'
          }}>
            {/* Background gradient orbs - decorative elements */}
            <div style={{
              position: 'absolute',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.accent.primary}25 0%, transparent 70%)`,
              top: '10%',
              right: '-100px',
              zIndex: '0'
            }} />
            <div style={{
              position: 'absolute',
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.accent.secondary}20 0%, transparent 70%)`,
              bottom: '5%',
              left: '-150px',
              zIndex: '0'
            }} />

            <div style={{ 
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 1.5rem',
              position: 'relative',
              zIndex: '1',
              overflowX: 'hidden' // Added to prevent horizontal scrolling in container
            }}>
              {/* Header */}
              <header style={{ 
                padding: '2rem 0 3rem',
                textAlign: 'center',
                borderBottom: `1px solid ${theme.background.accent}`,
                marginBottom: '2rem'
              }}>
                <h1 style={{ 
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: '800', 
                  color: theme.text.primary,
                  margin: '0 0 0.5rem',
                  letterSpacing: '-0.025em',
                  background: `linear-gradient(90deg, ${theme.accent.primary}, ${theme.accent.success})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 10px rgba(138, 135, 237, 0.15)'
                }}>
                  Solana Token Manager
                </h1>
                <p style={{
                  color: theme.text.secondary,
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  Create, mint, and manage your Solana tokens with ease
                </p>
              </header>

              {/* Wallet Button */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                margin: '2rem 0 3rem'
              }}>
                <WalletButton />
              </div>

              {/* Feature Selector */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 'clamp(0.5rem, 2vw, 1rem)',
                margin: '1rem 0 6rem',
                padding: '0.5rem',
                backgroundColor: theme.background.accent,
                borderRadius: '1rem',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
              }}>
                {features.map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFeature(feature.name)}
                    style={{
                      backgroundColor: selectedFeature === feature.name ? theme.accent.primary : 'transparent',
                      color: selectedFeature === feature.name ? theme.text.primary : theme.text.secondary,
                      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: selectedFeature === feature.name ? 
                        `0 4px 12px ${theme.accent.primary}50` : 'none'
                    }}
                  >
                    {feature.name}
                  </button>
                ))}
              </div>

              {/* Feature Display */}
              {selectedFeature && (
                <div style={{
                  width: '100%',
                  maxWidth: '800px',
                  margin: '0 auto 3rem',
                  padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                  color: theme.text.primary,
                  backgroundColor: theme.background.accent,
                  borderRadius: '1rem',
                  boxShadow: `0 12px 24px rgba(0, 0, 0, 0.2), 0 0 0 1px ${theme.accent.primary}30`,
                  border: `1px solid ${theme.accent.tertiary}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Decorative accent border */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.accent.primary}, ${theme.accent.success})`,
                    borderTopLeftRadius: '1rem',
                    borderTopRightRadius: '1rem'
                  }} />
                  
                  <h2 style={{
                    color: theme.text.primary,
                    fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                    marginTop: '0.5rem',
                    marginBottom: '1.5rem',
                    fontWeight: '700'
                  }}>
                    {selectedFeature}
                  </h2>
                  
                  {features.find(f => f.name === selectedFeature)?.component}
                </div>
              )}

              {/* Footer */}
              <footer style={{ 
                textAlign: 'center', 
                padding: '2rem 0 3rem', 
      
                color: theme.text.secondary,
                fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                borderTop: `1px solid ${theme.background.accent}`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: theme.accent.primary }}>⬢</span>
                  <span>Solana Token Manager</span>
                  <span style={{ color: theme.accent.primary }}>⬢</span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  Built with Vite + React
                </div>
              </footer>
            </div>
          </div>
        </TokenProvider>
      </WalletProvider>
    </SolanaProvider>
  );
}

export default App;