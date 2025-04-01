// contexts/WalletContext.js
import { createContext, useContext, useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState(0)

  const refreshBalance = async () => {
    if (!publicKey) return
    try {
      const balance = await connection.getBalance(publicKey)
      setBalance(balance / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error('Error refreshing balance:', error)
    }
  }

  useEffect(() => {
    if (connected) {
      refreshBalance()
    }
  }, [publicKey, connected])

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        balance,
        connected,
        refreshBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWalletContext = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider')
  }
  return context
}