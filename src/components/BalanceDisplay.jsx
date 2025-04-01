import { useEffect, useState } from 'react'
import { useWalletContext } from '../contexts/WalletContext'
import { useTokenContext } from '../contexts/TokenContext'

export const BalanceDisplay = () => {
  const { 
    publicKey, 
    balance, 
    refreshBalance,
    balanceLoading 
  } = useWalletContext()
  
  const { getTokenBalance } = useTokenContext()
  const [tokenBalances, setTokenBalances] = useState([])
  const [tokenAddress, setTokenAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAddToken = async () => {
    if (!tokenAddress.trim()) {
      setError('Please enter a valid token address')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      const balance = await getTokenBalance(tokenAddress)
      
      if (tokenBalances.some(t => t.address === tokenAddress)) {
        setError('Token already added')
        return
      }
      
      setTokenBalances(prev => [...prev, { 
        address: tokenAddress, 
        balance 
      }])
      setTokenAddress('')
    } catch (err) {
      console.error('Failed to fetch token balance:', err)
      setError('Failed to fetch token balance. Please check the address.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (publicKey) {
      refreshBalance()
    }
  }, [publicKey, refreshBalance])

  // Responsive dark theme styles
  const styles = {
    container: {
      width: '90%',
      maxWidth: '100%',
      padding: '1.5rem',
      backgroundColor: '#1E1B26',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    },
    title: {
      color: '#FFFFFF',
      fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
      fontWeight: '600',
      marginBottom: '1.5rem',
    },
    sectionTitle: {
      color: '#B8B5C0',
      fontSize: 'clamp(0.875rem, 4vw, 1rem)',
      fontWeight: '500',
      marginBottom: '1rem',
    },
    balanceValue: {
      color: '#FFFFFF',
      fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
      fontWeight: '600',
      margin: '0.5rem 0',
    },
    refreshButton: {
      padding: '0.625rem 1rem',
      backgroundColor: '#383553',
      color: '#B8B5C0',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    refreshButtonHover: {
      backgroundColor: '#5F8BFF',
      color: '#FFFFFF',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(95, 139, 255, 0.25)',
    },
    refreshButtonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    tokenList: {
      margin: '1rem 0',
    },
    tokenItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 0',
      borderBottom: '1px solid #383553',
    },
    tokenAddress: {
      color: '#B8B5C0',
      fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
      fontFamily: 'monospace',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '70%',
    },
    tokenBalance: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    },
    inputContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      marginTop: '1.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #383553',
      borderRadius: '0.5rem',
      backgroundColor: 'rgba(30, 27, 38, 0.8)',
      color: '#FFFFFF',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    inputFocus: {
      borderColor: '#5F8BFF',
      boxShadow: '0 0 0 2px rgba(95, 139, 255, 0.2)',
      backgroundColor: 'rgba(30, 27, 38, 0.6)',
    },
    addButton: {
      width: '100%',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#5F8BFF',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '0.5rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '1rem',
    },
    addButtonHover: {
      backgroundColor: '#4A7AFF',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(95, 139, 255, 0.25)',
    },
    addButtonDisabled: {
      backgroundColor: '#383553',
      cursor: 'not-allowed',
      opacity: 0.7,
    },
    error: {
      color: '#FF5C5C',
      margin: '0.5rem 0',
      padding: '0.75rem 1rem',
      backgroundColor: 'rgba(255, 92, 92, 0.1)',
      borderRadius: '0.5rem',
      fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
      borderLeft: '3px solid #FF5C5C',
      wordBreak: 'break-word',
    },
    emptyState: {
      color: '#B8B5C0',
      fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
      textAlign: 'center',
      padding: '1rem',
    },
    helpText: {
      fontSize: 'clamp(0.7rem, 3vw, 0.75rem)',
      color: '#B8B5C0',
      marginTop: '0.25rem',
    },
    formGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      color: '#B8B5C0',
      marginBottom: '0.5rem',
      fontWeight: '500',
      fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
    },
  }

  // Media query helper
  const getResponsiveStyle = () => {
    // Check if window exists (to avoid SSR issues)
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width <= 480) {
        return {
          container: {
            padding: '1rem',
          },
          refreshButton: {
            padding: '0.5rem 0.75rem',
            fontSize: '0.75rem',
          },
          input: {
            padding: '0.625rem 0.75rem',
            fontSize: '0.875rem',
          },
          addButton: {
            padding: '0.625rem 1rem',
            fontSize: '0.875rem',
          },
          inputContainer: {
            marginTop: '1rem',
          },
        };
      }
      if (width > 768) {
        return {
          inputContainer: {
            flexDirection: 'row',
          },
          addButton: {
            width: 'auto',
          },
        };
      }
    }
    return {};
  }

  // Merge responsive styles
  const responsiveStyles = getResponsiveStyle();

  return (
    <div style={{...styles.container, ...responsiveStyles.container}}>
      <h2 style={styles.title}>Wallet Balances</h2>
      
      {/* SOL Balance Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={styles.sectionTitle}>SOL Balance</h3>
          <button 
            onClick={refreshBalance}
            disabled={balanceLoading}
            style={balanceLoading ? 
              {...styles.refreshButton, ...styles.refreshButtonDisabled, ...responsiveStyles.refreshButton} : 
              {...styles.refreshButton, ...responsiveStyles.refreshButton}}
            onMouseOver={(e) => {
              if (!balanceLoading) {
                e.currentTarget.style.backgroundColor = styles.refreshButtonHover.backgroundColor;
                e.currentTarget.style.color = styles.refreshButtonHover.color;
                e.currentTarget.style.transform = styles.refreshButtonHover.transform;
                e.currentTarget.style.boxShadow = styles.refreshButtonHover.boxShadow;
              }
            }}
            onMouseOut={(e) => {
              if (!balanceLoading) {
                e.currentTarget.style.backgroundColor = styles.refreshButton.backgroundColor;
                e.currentTarget.style.color = styles.refreshButton.color;
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {balanceLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <p style={styles.balanceValue}>
          {balanceLoading ? 'Loading...' : `${balance} SOL`}
        </p>
      </div>
      
      {/* Token Balances Section */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={styles.sectionTitle}>Token Balances</h3>
        
        {error && (
          <div style={styles.error}>{error}</div>
        )}
        
        {tokenBalances.length === 0 ? (
          <div style={styles.emptyState}>No tokens added yet</div>
        ) : (
          <div style={styles.tokenList}>
            {tokenBalances.map((token, index) => (
              <div key={index} style={styles.tokenItem}>
                <span style={styles.tokenAddress}>{token.address}</span>
                <span style={styles.tokenBalance}>{token.balance}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Token Form */}
      <div style={{...styles.formGroup, marginTop: '1.5rem'}}>
        <label style={styles.label} htmlFor="tokenAddress">
          Token Address
        </label>
        <div style={{...styles.inputContainer, ...responsiveStyles.inputContainer}}>
          <div style={{width: '100%', position: 'relative'}}>
            <input
              id="tokenAddress"
              type="text"
              value={tokenAddress}
              onChange={(e) => {
                setTokenAddress(e.target.value)
                setError(null)
              }}
              placeholder="Enter token address"
              style={{...styles.input, ...responsiveStyles.input}}
              onFocus={(e) => {
                e.target.style.borderColor = styles.inputFocus.borderColor;
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
                e.target.style.backgroundColor = styles.inputFocus.backgroundColor;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.input.border.split(' ')[2];
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = styles.input.backgroundColor;
              }}
              disabled={loading}
            />
            <div style={styles.helpText}>The address of the token to display</div>
          </div>
          <button
            onClick={handleAddToken}
            disabled={loading || !tokenAddress.trim()}
            style={loading || !tokenAddress.trim() ? 
              {...styles.addButton, ...styles.addButtonDisabled, ...responsiveStyles.addButton} : 
              {...styles.addButton, ...responsiveStyles.addButton}}
            onMouseOver={(e) => {
              if (!loading && tokenAddress.trim()) {
                e.currentTarget.style.backgroundColor = styles.addButtonHover.backgroundColor;
                e.currentTarget.style.transform = styles.addButtonHover.transform;
                e.currentTarget.style.boxShadow = styles.addButtonHover.boxShadow;
              }
            }}
            onMouseOut={(e) => {
              if (!loading && tokenAddress.trim()) {
                e.currentTarget.style.backgroundColor = styles.addButton.backgroundColor;
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? 'Adding...' : 'Add Token'}
          </button>
        </div>
      </div>
    </div>
  )
}