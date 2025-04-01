import { useState } from 'react'
import { useTokenContext } from '../contexts/TokenContext'

export const TokenSender = () => {
  const { sendTokens, loading, error } = useTokenContext()
  const [formData, setFormData] = useState({
    tokenAddress: '',
    recipient: '',
    amount: 10,
  })
  const [sendSuccess, setSendSuccess] = useState(null)

  const handleChange = (e) => {
    const value = e.target.type === 'number' 
      ? Math.max(0, Number(e.target.value))
      : e.target.value;
      
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const txSignature = await sendTokens(
        formData.tokenAddress,
        formData.recipient,
        Number(formData.amount)
      )
      setSendSuccess(`Tokens sent! Transaction: ${txSignature}`)
    } catch (err) {
      console.error(err)
    }
  }

  // Responsive dark theme styles
  const styles = {
    container: {
      width: '100%',
      maxWidth: '100%',
      padding: '0 1rem',
    },
    form: {
      width: '100%',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      color: '#B8B5C0',
      marginBottom: '0.5rem',
      fontWeight: '500',
      fontSize: '0.875rem',
    },
    input: {
      width: '90%',
      padding: '0.75rem 1rem',
      border: '1px solid #383553',
      borderRadius: '0.5rem',
      backgroundColor: 'rgba(30, 27, 38, 0.8)',
      color: '#fff',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    focusedInput: {
      borderColor: '#5F8BFF',
      boxShadow: '0 0 0 2px rgba(95, 139, 255, 0.2)',
      backgroundColor: 'rgba(30, 27, 38, 0.6)',
    },
    button: {
      marginTop: '1.5rem',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#5F8BFF',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '1rem',
      width: '100%',
    },
    buttonHover: {
      backgroundColor: '#4A7AFF',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(95, 139, 255, 0.25)',
    },
    buttonDisabled: {
      backgroundColor: '#383553',
      cursor: 'not-allowed',
      opacity: 0.7,
    },
    error: {
      color: '#FF5C5C',
      marginBottom: '1rem',
      padding: '0.75rem 1rem',
      backgroundColor: 'rgba(255, 92, 92, 0.1)',
      borderRadius: '0.5rem',
      borderLeft: '3px solid #FF5C5C',
      wordBreak: 'break-word',
    },
    success: {
      color: '#50E3C2',
      marginBottom: '1.5rem',
      padding: '0.75rem 1rem',
      backgroundColor: 'rgba(80, 227, 194, 0.1)',
      borderRadius: '0.5rem',
      borderLeft: '3px solid #50E3C2',
      wordBreak: 'break-word',
    },
    inputBox: {
      position: 'relative',
    },
    helpText: {
      fontSize: '0.75rem',
      color: '#B8B5C0',
      marginTop: '0.25rem',
    },
    responsiveText: {
      fontSize: 'clamp(0.875rem, 4vw, 1rem)',
    },
  }

  // Media query helper
  const getResponsiveStyle = () => {
    // Check if window exists (to avoid SSR issues)
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width <= 480) {
        return {
          input: {
            padding: '0.625rem 0.75rem',
            fontSize: '0.875rem',
          },
          button: {
            padding: '0.625rem 1rem',
            fontSize: '0.875rem',
          },
          helpText: {
            fontSize: '0.7rem',
          }
        };
      }
    }
    return {};
  }

  // Merge responsive styles
  const responsiveStyles = getResponsiveStyle();

  return (
    <div style={styles.container}>
      {error && <div style={{...styles.error, ...styles.responsiveText}}>{error}</div>}
      
      {sendSuccess && (
        <div style={{...styles.success, ...styles.responsiveText}}>
          <strong>Tokens sent successfully!</strong>
          <div style={{ marginTop: '0.5rem', fontSize: 'clamp(0.75rem, 3vw, 0.875rem)' }}>
            Transaction: {sendSuccess}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={{...styles.label, ...styles.responsiveText}} htmlFor="tokenAddress">
            Token Address
          </label>
          <div style={styles.inputBox}>
            <input
              type="text"
              id="tokenAddress"
              name="tokenAddress"
              value={formData.tokenAddress}
              onChange={handleChange}
              style={{...styles.input, ...responsiveStyles.input}}
              onFocus={(e) => {
                e.target.style.borderColor = styles.focusedInput.borderColor;
                e.target.style.boxShadow = styles.focusedInput.boxShadow;
                e.target.style.backgroundColor = styles.focusedInput.backgroundColor;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.input.border.split(' ')[2];
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = styles.input.backgroundColor;
              }}
              placeholder="e.g., 9xDLaeFqM..."
              required
            />
            <div style={{...styles.helpText, ...responsiveStyles.helpText}}>The address of the token to send</div>
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label style={{...styles.label, ...styles.responsiveText}} htmlFor="recipient">
            Recipient Address
          </label>
          <div style={styles.inputBox}>
            <input
              type="text"
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              style={{...styles.input, ...responsiveStyles.input}}
              onFocus={(e) => {
                e.target.style.borderColor = styles.focusedInput.borderColor;
                e.target.style.boxShadow = styles.focusedInput.boxShadow;
                e.target.style.backgroundColor = styles.focusedInput.backgroundColor;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.input.border.split(' ')[2];
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = styles.input.backgroundColor;
              }}
              placeholder="e.g., 3JDq8n54..."
              required
            />
            <div style={{...styles.helpText, ...responsiveStyles.helpText}}>The wallet address of the recipient</div>
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label style={{...styles.label, ...styles.responsiveText}} htmlFor="amount">
            Amount to Send
          </label>
          <div style={styles.inputBox}>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              style={{...styles.input, ...responsiveStyles.input}}
              onFocus={(e) => {
                e.target.style.borderColor = styles.focusedInput.borderColor;
                e.target.style.boxShadow = styles.focusedInput.boxShadow;
                e.target.style.backgroundColor = styles.focusedInput.backgroundColor;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = styles.input.border.split(' ')[2];
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = styles.input.backgroundColor;
              }}
              min="0.1"
              step="0.1"
              required
            />
            <div style={{...styles.helpText, ...responsiveStyles.helpText}}>Number of tokens to transfer</div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={loading ? 
            {...styles.button, ...styles.buttonDisabled, ...responsiveStyles.button} : 
            {...styles.button, ...responsiveStyles.button}}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
              e.target.style.transform = styles.buttonHover.transform;
              e.target.style.boxShadow = styles.buttonHover.boxShadow;
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = styles.button.backgroundColor;
              e.target.style.transform = 'none';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {loading ? 'Sending Tokens...' : 'Send Tokens'}
        </button>
      </form>
    </div>
  )
}