import React, { useRef } from 'react';

interface OtpModalProps {
    open: boolean;
    field: string | null;
    value: string;
    otp: string;
    onOtpChange: (otp: string) => void;
    onCancel: () => void;
    onVerify: () => void;
    error?: string;
    loading?: boolean;
    otpDestination?: 'mobile' | 'email' | null;
    otpDestinationValue?: string;
}


const OtpModal: React.FC<OtpModalProps> = ({ open, field, otp, onOtpChange, onCancel, onVerify, error, loading, otpDestination, otpDestinationValue }) => {
    if (!open) return null;

    console.log(otpDestination, otpDestinationValue);


    return (
        <div className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-text-primary tw-bg-primary/5 tw-backdrop-blur-sm">
            <div className="tw-bg-secondary tw-rounded-xl tw-shadow-2xl tw-p-6 tw-w-full tw-max-w-xs tw-flex tw-flex-col tw-gap-4">
                <div className=" tw-font-semibold tw-text-center">
                    {otpDestination && otpDestinationValue ? (
                        <div className='tw-flex tw-flex-col'>
                            <span>Enter the OTP sent on {otpDestination === 'mobile' ? 'mobile' : 'email'}:</span>
                            <span className="tw-text-primary tw-font-medium tw-underline tw-text-sm">{otpDestinationValue}</span>
                        </div>
                    ) : (
                        <>Enter OTP for {field}</>
                    )}
                </div>
                <OtpInput otp={otp} onOtpChange={onOtpChange} />
                {error && <div className="tw-text-red-600 tw-text-xs tw-text-center">{error}</div>}
                <div className="tw-flex tw-gap-2 tw-justify-center">
                    <button
                        className="tw-bg-primary tw-text-secondary tw-px-4 tw-py-2 tw-rounded tw-font-medium hover:tw-bg-primary/90"
                        onClick={onVerify}
                        disabled={loading || !otp}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button
                        className="tw-bg-secondary tw-text-primary tw-px-4 tw-py-2 tw-rounded tw-font-medium tw-border tw-border-primary hover:tw-bg-secondary/80"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

function OtpInput({ otp, onOtpChange }: { otp: string, onOtpChange: (otp: string) => void }) {
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const OTP_LENGTH = 4;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (!val) return;
        let newOtp = otp.split('');
        newOtp[idx] = val[val.length - 1];
        onOtpChange(newOtp.join('').padEnd(OTP_LENGTH, ''));
        // Move focus to next input
        if (val && idx < OTP_LENGTH - 1) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'Backspace') {
            if (otp[idx]) {
                // Clear current
                let newOtp = otp.split('');
                newOtp[idx] = '';
                onOtpChange(newOtp.join(''));
            } else if (idx > 0) {
                // Move to previous
                inputsRef.current[idx - 1]?.focus();
                let newOtp = otp.split('');
                newOtp[idx - 1] = '';
                onOtpChange(newOtp.join(''));
            }
        } else if (e.key === 'ArrowLeft' && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        } else if (e.key === 'ArrowRight' && idx < OTP_LENGTH - 1) {
            inputsRef.current[idx + 1]?.focus();
        } else if (/^[0-9]$/.test(e.key)) {
            // Replace and move to next
            let newOtp = otp.split('');
            newOtp[idx] = e.key;
            onOtpChange(newOtp.join('').padEnd(OTP_LENGTH, ''));
            if (idx < OTP_LENGTH - 1) {
                setTimeout(() => inputsRef.current[idx + 1]?.focus(), 0);
            }
            e.preventDefault();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData('Text').replace(/[^0-9]/g, '');
        if (paste.length === OTP_LENGTH) {
            onOtpChange(paste);
            // Focus last input
            setTimeout(() => {
                inputsRef.current[OTP_LENGTH - 1]?.focus();
            }, 0);
        } else if (paste.length > 1) {
            // Partial paste
            let newOtp = otp.split('');
            for (let i = 0; i < Math.min(paste.length, OTP_LENGTH); i++) {
                newOtp[i] = paste[i];
            }
            onOtpChange(newOtp.join('').padEnd(OTP_LENGTH, ''));
            setTimeout(() => {
                inputsRef.current[Math.min(paste.length, OTP_LENGTH) - 1]?.focus();
            }, 0);
        }
        e.preventDefault();
    };

    return (
        <div className='tw-flex tw-w-full tw-justify-center tw-items-center'>
            <div className='tw-flex tw-gap-2'>
                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                    <input
                        key={index}
                        ref={el => (inputsRef.current[index] = el)}
                        className="tw-border tw-rounded tw-p-2 tw-w-10 tw-h-10 tw-border-primary/50 tw-text-center tw-font-medium focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-primary"
                        value={otp[index] || ''}
                        onChange={e => handleChange(e, index)}
                        onKeyDown={e => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        maxLength={1}
                        autoFocus={index === 0}
                        inputMode="numeric"
                    />
                ))}
            </div>
        </div>
    );
}

export default OtpModal; 