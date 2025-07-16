import { useState } from 'react';

export type OtpErrorType = string | { error?: boolean; error_type?: string; error_message?: string };
export function useOtpModal() {
    const [otpField, setOtpField] = useState<string | null>(null);
    const [otpValue, setOtpValue] = useState('');
    const [otpError, setOtpError] = useState<OtpErrorType>('');
    const [otpLoading, setOtpLoading] = useState(false);

    return {
        otpField, setOtpField,
        otpValue, setOtpValue,
        otpError, setOtpError,
        otpLoading, setOtpLoading,
    };
} 