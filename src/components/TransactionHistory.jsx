import { useState, useEffect } from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import { Connection, PublicKey } from '@solana/web3.js';

export const TransactionHistory = () => {
  const { publicKey, connected } = useWalletContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [currentEndpointIndex, setCurrentEndpointIndex] = useState(0);

  // Prioritized list of RPC endpoints with failover
  const RPC_ENDPOINTS = [
    'https://api.devnet.solana.com', // Primary
    'https://solana-devnet.rpcpool.com', // Secondary
    'https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY' // Backup (register at helius.dev)
  ];

  const fetchTransactions = async (retryCount = 0) => {
    if (!publicKey) {
      setError('Wallet not connected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = RPC_ENDPOINTS[currentEndpointIndex];
      const connection = new Connection(endpoint, {
        commitment: 'confirmed',
        disableRetryOnRateLimit: false
      });

      console.log(`Fetching transactions using endpoint: ${endpoint}`);

      // Get recent transaction signatures
      const txSignatures = await connection.getSignaturesForAddress(
        publicKey,
        { limit: 5 }
      );

      if (!txSignatures || txSignatures.length === 0) {
        setTransactions([]);
        return;
      }

      // Get full transaction details in parallel
      const txDetails = await Promise.all(
        txSignatures.map(sig => 
          connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0
          })
      ));

      // Filter out null responses and sort by blockTime (newest first)
      const validTransactions = txDetails
        .filter(tx => tx !== null)
        .sort((a, b) => (b.blockTime || 0) - (a.blockTime || 0));

      setTransactions(validTransactions);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      console.error(`Transaction fetch error (attempt ${retryCount + 1}):`, err);

      if (retryCount < RPC_ENDPOINTS.length - 1) {
        // Rotate to next RPC endpoint
        const nextIndex = (currentEndpointIndex + 1) % RPC_ENDPOINTS.length;
        setCurrentEndpointIndex(nextIndex);
        await fetchTransactions(retryCount + 1);
      } else {
        setError(
          err.message.includes('fetch') ? 
          'Network error - please try again later' : 
          `Failed to load transactions: ${err.message}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh when wallet connects/changes
  useEffect(() => {
    if (connected) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setError('Connect your wallet to view transactions');
    }
  }, [publicKey, connected]);

  // Styles with dark theme and responsive design
  const styles = {
    container: {
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '1.5rem',
      backgroundColor: '#1A1A2E',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      color: '#E2E8F0',
      fontFamily: 'Inter, sans-serif'
    },
    title: {
      color: '#E2E8F0',
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    button: {
      width: '100%',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#4F46E5',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: '1.5rem',
      fontSize: '1rem',
      ':hover': {
        backgroundColor: '#4338CA',
        transform: 'translateY(-1px)'
      },
      ':disabled': {
        backgroundColor: '#4B5563',
        cursor: 'not-allowed',
        opacity: '0.7'
      }
    },
    error: {
      color: '#F87171',
      backgroundColor: 'rgba(248, 113, 113, 0.1)',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      borderLeft: '3px solid #F87171',
      fontSize: '0.875rem',
      wordBreak: 'break-word'
    },
    noTransactions: {
      color: '#94A3B8',
      padding: '1.5rem',
      textAlign: 'center',
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      borderRadius: '0.5rem',
      fontSize: '0.875rem'
    },
    transactionList: {
      width: '100%',
      marginTop: '1rem'
    },
    transactionItem: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      transition: 'all 0.2s ease',
      ':hover': {
        borderColor: '#4F46E5',
        transform: 'translateY(-2px)'
      }
    },
    transactionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem'
    },
    transactionTitle: {
      color: '#E2E8F0',
      fontWeight: '500',
      fontSize: '0.875rem'
    },
    transactionStatus: {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '600'
    },
    statusSuccess: {
      backgroundColor: 'rgba(74, 222, 128, 0.1)',
      color: '#4ADE80'
    },
    statusFailed: {
      backgroundColor: 'rgba(248, 113, 113, 0.1)',
      color: '#F87171'
    },
    transactionLink: {
      color: '#60A5FA',
      textDecoration: 'none',
      fontSize: '0.875rem',
      display: 'block',
      marginBottom: '0.5rem',
      transition: 'color 0.2s ease',
      ':hover': {
        color: '#3B82F6',
        textDecoration: 'underline'
      }
    },
    transactionSignature: {
      color: '#94A3B8',
      fontSize: '0.75rem',
      fontFamily: 'monospace',
      wordBreak: 'break-all',
      opacity: '0.8'
    },
    refreshInfo: {
      color: '#64748B',
      fontSize: '0.75rem',
      textAlign: 'right'
    },
    loadingDots: {
      display: 'inline-block',
      width: '1rem',
      textAlign: 'left'
    }
  };

  // Helper to format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Pending';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Transaction status component
  const TransactionStatus = ({ tx }) => {
    if (!tx.meta) return null;
    
    return tx.meta.err ? (
      <span style={{...styles.transactionStatus, ...styles.statusFailed}}>
        Failed
      </span>
    ) : (
      <span style={{...styles.transactionStatus, ...styles.statusSuccess}}>
        Success
      </span>
    );
  };

  // Loading indicator component
  const LoadingDots = () => (
    <span style={styles.loadingDots}>
      <span className="dot">.</span>
      <span className="dot">.</span>
      <span className="dot">.</span>
    </span>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        Transaction History
        {lastRefresh && (
          <span style={styles.refreshInfo}>
            Last refresh: {lastRefresh.toLocaleTimeString()}
          </span>
        )}
      </h2>

      {error && (
        <div style={styles.error}>
          {error}
          {loading && <LoadingDots />}
        </div>
      )}

      <button
        onClick={fetchTransactions}
        disabled={loading}
        style={{
          ...styles.button,
          ...(loading && styles.button[':disabled']),
          ...(!loading && styles.button[':hover'])
        }}
      >
        {loading ? 'Refreshing...' : 'Refresh Transactions'}
      </button>

      {!connected ? (
        <div style={styles.noTransactions}>
          Please connect your wallet to view transaction history
        </div>
      ) : transactions.length === 0 && !loading ? (
        <div style={styles.noTransactions}>
          No transactions found for this wallet
        </div>
      ) : (
        <div style={styles.transactionList}>
          {transactions.map((tx, index) => (
            <div key={index} style={styles.transactionItem}>
              <div style={styles.transactionHeader}>
                <div style={styles.transactionTitle}>
                  Transaction #{index + 1}
                </div>
                <TransactionStatus tx={tx} />
              </div>

              {tx.blockTime && (
                <div style={{ color: '#94A3B8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                  {formatTime(tx.blockTime)}
                </div>
              )}

              <a
                href={`https://explorer.solana.com/tx/${tx.transaction.signatures[0]}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.transactionLink}
              >
                View on Solana Explorer ↗
              </a>

              <div style={styles.transactionSignature}>
                {tx.transaction.signatures[0].slice(0, 15)}...
                {tx.transaction.signatures[0].slice(-10)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};