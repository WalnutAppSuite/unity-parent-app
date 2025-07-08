import { useState } from 'react';

export function useOtpModal() {
    const [otpField, setOtpField] = useState<string | null>(null);
    const [otpValue, setOtpValue] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    return {
        otpField, setOtpField,
        otpValue, setOtpValue,
        otpError, setOtpError,
        otpLoading, setOtpLoading,
    };
} 