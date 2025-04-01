import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export const WalletButton = () => {
  const { connected, publicKey, disconnect } = useWallet()

  // Inline styles that will work regardless of Tailwind
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center'
    },
    walletAddress: {
      fontSize: '1.3rem',
      fontWeight: '500',
      color: '#A55B4B'
    },
    disconnectButton: {
      fontSize: '1rem',
      color: '#A55B4B',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
      marginLeft: '0.5rem',
      transition: 'color 0.2s ease'
    },
    disconnectButtonHover: {
      color: '#A55B4B'
    },
    connectButton: {
      backgroundColor: '#8b5cf6',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    },
    connectButtonHover: {
      backgroundColor: '#7c3aed'
    }
  }

  return (
    <div style={styles.container}>
      {connected ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={styles.walletAddress}>
            {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
          </span>
          <button
            onClick={disconnect}
            style={styles.disconnectButton}
            onMouseOver={(e) => e.currentTarget.style.color = styles.disconnectButtonHover.color}
            onMouseOut={(e) => e.currentTarget.style.color = styles.disconnectButton.color}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <WalletMultiButton 
          style={styles.connectButton}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.connectButtonHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.connectButton.backgroundColor}
        />
      )}
    </div>
  )
}