import { createContext, useContext, useState } from 'react';
import { 
  PublicKey, 
  Transaction,
  SystemProgram,
  Keypair
} from '@solana/web3.js';

import { 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction, 
  getAccount, 
  createMintToInstruction,
  createInitializeMintInstruction,
  getMint,
  mintTo,
  createTransferInstruction,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createToken = async (name, symbol, decimals, amount) => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Creating mint with params:", { 
        connection: !!connection, 
        publicKey: publicKey.toString(),
        decimals 
      });
      
      // Generate a new keypair for the mint account
      const mintKeypair = Keypair.generate();
      const mint = mintKeypair.publicKey;
      
      console.log("Generated mint address:", mint.toString());
      
      // Calculate the lamports (rent) needed for the mint
      const lamports = await connection.getMinimumBalanceForRentExemption(
        82 // spl-token mint size
      );
      
      // Create instructions for the transaction
      const transaction = new Transaction();
      
      // Create instruction to create a mint account
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mint,
          space: 82,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );
      
      // Create instruction to initialize the mint
      transaction.add(
        createInitializeMintInstruction(
          mint,
          decimals,
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        )
      );
      
      // Create the associated token account
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mint,
        publicKey
      );
      
      transaction.add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenAddress,
          publicKey,
          mint
        )
      );
      
      // Mint tokens to the associated token account
      const amountToMint = BigInt(amount * (10 ** decimals));
      transaction.add(
        createMintToInstruction(
          mint,
          associatedTokenAddress,
          publicKey,
          amountToMint
        )
      );
      
      // Sign the transaction with the mint keypair and send it using the wallet
      transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
      transaction.feePayer = publicKey;
      transaction.partialSign(mintKeypair);
      
      const signature = await sendTransaction(transaction, connection);
      console.log("Transaction sent:", signature);
      
      await connection.confirmTransaction(signature, 'confirmed');
      console.log("Transaction confirmed");
      
      return mint.toString();
      
    } catch (err) {
      console.error("Token creation error:", err);
      setError(err.message || 'Failed to create token');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const mintTokens = async (tokenAddress, amount) => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    setLoading(true);
    setError(null);
    
    try {
      const mintPublicKey = new PublicKey(tokenAddress);
      const mintInfo = await getMint(connection, mintPublicKey);
      const associatedTokenAddress = await getAssociatedTokenAddress(mintPublicKey, publicKey);
      
      // This is the corrected part
      const transaction = new Transaction().add(
        createMintToInstruction(
          mintPublicKey,
          associatedTokenAddress,
          publicKey,
          BigInt(amount * Math.pow(10, mintInfo.decimals))
        )
      );
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      
      return 'Tokens minted successfully';
    } catch (err) {
      setError(err.message || 'Failed to mint tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const sendTokens = async (tokenAddress, recipient, amount) => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    setLoading(true);
    setError(null);
    
    try {
      // Validate the token address is a proper public key
      let mintPublicKey;
      try {
        mintPublicKey = new PublicKey(tokenAddress);
        console.log("Token address parsed successfully:", mintPublicKey.toString());
      } catch (err) {
        throw new Error(`Invalid token address: ${err.message}`);
      }
  
      // Validate the recipient address is a proper public key
      let recipientPublicKey;
      try {
        recipientPublicKey = new PublicKey(recipient);
        console.log("Recipient address parsed successfully:", recipientPublicKey.toString());
      } catch (err) {
        throw new Error(`Invalid recipient address: ${err.message}`);
      }
  
      // Check if the mint account exists and is owned by the Token Program
      const mintAccount = await connection.getAccountInfo(mintPublicKey);
      if (!mintAccount) {
        throw new Error('Token mint account does not exist');
      }
      
      if (!mintAccount.owner.equals(TOKEN_PROGRAM_ID)) {
        throw new Error('Token mint account is not owned by the SPL Token program');
      }
      
      console.log("Mint account validated, getting mint info");
      
      // Now try to get the mint info
      const mintInfo = await getMint(connection, mintPublicKey);
      console.log("Mint info retrieved:", mintInfo.decimals);
      
      // Continue with the rest of the function...
      const fromTokenAccount = await getAssociatedTokenAddress(mintPublicKey, publicKey);
      const toTokenAccount = await getAssociatedTokenAddress(mintPublicKey, recipientPublicKey);
      
      // Rest of your function remains the same...
    } catch (err) {
      console.error("Transfer error:", err);
      setError(err.message || 'Failed to send tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getTokenBalance = async (tokenAddress) => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    try {
      const mintPublicKey = new PublicKey(tokenAddress);
      const associatedTokenAddress = await getAssociatedTokenAddress(mintPublicKey, publicKey);
      
      try {
        const accountInfo = await getAccount(connection, associatedTokenAddress);
        const mintInfo = await getMint(connection, mintPublicKey);
        return Number(accountInfo.amount) / Math.pow(10, mintInfo.decimals);
      } catch (err) {
        if (err.name === 'TokenAccountNotFoundError') {
          return 0;
        }
        throw err;
      }
    } catch (err) {
      setError(err.message || 'Failed to get token balance');
      throw err;
    }
  };

  return (
    <TokenContext.Provider
      value={{
        createToken,
        mintTokens,
        sendTokens,
        getTokenBalance,
        loading,
        error,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokenContext must be used within a TokenProvider');
  }
  return context;
};