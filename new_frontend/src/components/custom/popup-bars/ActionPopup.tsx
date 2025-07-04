import { motion } from "framer-motion";
import type { ActionPopupProps } from '@/types/students';

function ActionPopup({ isVisible, onSave, onCancel, title, message, saveButtonText, cancelButtonText }: ActionPopupProps) {
    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    margin: '20px',
                    maxWidth: '400px',
                    width: '100%',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}
            >
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: '#374151'
                }}>
                    {title}
                </h3>

                <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '20px'
                }}>
                    {message}
                </p>

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            backgroundColor: 'white',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                        }}
                    >
                        {cancelButtonText}
                    </button>

                    <button
                        onClick={onSave}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#3b82f6';
                        }}
                    >
                        {saveButtonText}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default ActionPopup;