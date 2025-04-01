import { useState } from 'react'
import { useTokenContext } from '../contexts/TokenContext'

export const TokenCreator = () => {
  const { createToken, loading, error } = useTokenContext()
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    decimals: 9,
    amount: 1000,
  })
  const [createdToken, setCreatedToken] = useState(null)

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
      if (!createToken) {
        console.error("createToken function is undefined")
        return
      }
      
      const tokenAddress = await createToken(
        formData.name,
        formData.symbol,
        Number(formData.decimals),
        Number(formData.amount)
      )
      
      if (tokenAddress) {
        setCreatedToken(tokenAddress)
      } else {
        console.error("Token creation failed - no address returned")
      }
    } catch (err) {
      console.error("Error creating token:", err)
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
      
      {createdToken && (
        <div style={{...styles.success, ...styles.responsiveText}}>
          <strong>Token created successfully!</strong>
          <div style={{ marginTop: '0.5rem', fontSize: 'clamp(0.75rem, 3vw, 0.875rem)' }}>
            Token Address: {createdToken}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={{...styles.label, ...styles.responsiveText}} htmlFor="name">
            Token Name
          </label>
          <div style={styles.inputBox}>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
              placeholder="e.g., My Token"
              required
            />
            <div style={{...styles.helpText, ...responsiveStyles.helpText}}>The full name of your token</div>
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label style={{...styles.label, ...styles.responsiveText}} htmlFor="symbol">
            Token Symbol
          </label>
          <div style={styles.inputBox}>
            <input
              type="text"
              id="symbol"
              name="symbol"
              value={formData.symbol}
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
              placeholder="e.g., MTK"
              required
            />
            <div style={{...styles.helpText, ...responsiveStyles.helpText}}>Short ticker symbol (2-5 characters recommended)</div>
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label style={{...styles.label, ...styles.responsiveText}} htmlFor="decimals">
            Decimals
          </label>
          <div style={styles.inputBox}>
            <input
              type="number"
              id="decimals"
              name="decimals"
              value={formData.decimals}
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
              min="0"
              max="18"
              required
            />
            <div style={{...styles.helpText, ...responsiveStyles.helpText}}>Token precision (9 recommended for most cases)</div>
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label style={{...styles.label, ...styles.responsiveText}} htmlFor="amount">
            Initial Supply
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
              min="1"
              required
            />
            <div style={{...styles.helpText, ...responsiveStyles.helpText}}>Number of tokens to mint initially</div>
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
          {loading ? 'Creating Token...' : 'Create Token'}
        </button>
      </form>
    </div>
  )
}