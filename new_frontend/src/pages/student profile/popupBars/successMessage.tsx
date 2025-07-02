import React from 'react';
import { motion } from 'framer-motion';

interface SuccessMessageProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  isVisible, 
  onClose, 
  type = 'success' 
}) => {
  if (!isVisible) return null;

  // Dynamic colors based on message type
  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: '#10b981',
          shadow: 'rgba(16, 185, 129, 0.3)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'error':
        return {
          bg: '#ef4444',
          shadow: 'rgba(239, 68, 68, 0.3)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      case 'info':
        return {
          bg: '#3b82f6',
          shadow: 'rgba(59, 130, 246, 0.3)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" />
            </svg>
          )
        };
      default:
        return {
          bg: '#10b981',
          shadow: 'rgba(16, 185, 129, 0.3)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ 
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.3
      }}
      style={{
        position: 'fixed',
        top: '20px',
        left: '9%',
        transform: 'translateX(-50%)',
        backgroundColor: colors.bg,
        color: 'white',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: `0 8px 32px ${colors.shadow}`,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start', // ✅ Changed to flex-start to handle multi-line text
        justifyContent: 'flex-start',
        gap: '8px',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: '600',
        fontSize: '13px',
        maxWidth: '85vw',
        minWidth: '280px',
        width: 'auto',
        textAlign: 'left',
        backdropFilter: 'blur(10px)',
        border: `1px solid rgba(255, 255, 255, 0.2)`,
        margin: '0 auto',
        boxSizing: 'border-box',
        minHeight: '44px' // ✅ Set minimum height for consistency
      }}
    >
      {/* Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        flexShrink: 0,
        marginTop: '2px' // ✅ Slight top margin to align with first line of text
      }}>
        {colors.icon}
      </div>
      
      {/* Message */}
      <span style={{
        flex: 1,
        textAlign: 'left',
        lineHeight: '1.3',
        whiteSpace: 'normal', // ✅ Allow text wrapping
        wordWrap: 'break-word', // ✅ Break long words
        overflowWrap: 'break-word', // ✅ Modern alternative to word-wrap
        overflow: 'hidden', // ✅ Still hide overflow
        maxWidth: 'calc(100% - 60px)' // ✅ Reserve space for icon and close button
      }}>
        {message}
      </span>
      
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'all 0.2s ease',
          flexShrink: 0,
          width: '24px',
          height: '24px',
          alignSelf: 'flex-start', // ✅ Align to top when text wraps
          marginTop: '2px' // ✅ Slight top margin to align with first line
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
};

export default SuccessMessage;