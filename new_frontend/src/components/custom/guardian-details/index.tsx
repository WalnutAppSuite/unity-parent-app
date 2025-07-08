import React from 'react';
import EditableField from '@/components/custom/editable-field';
import type { GuardianDetailsProps } from '@/types/students';
import { useTranslation } from 'react-i18next';

const GuardianDetails: React.FC<Omit<GuardianDetailsProps, 'setOtpField' | 'setOtpValue' | 'setOtpError'>> = ({ label, guardian, emailValue, mobileValue, incomeValue, onEmailChange, onMobileChange, onIncomeChange, onUpdate, onSendOtp }) => {
    const { t } = useTranslation('student_profile');

    return (
        <>
            <div className='tw-mt-2 tw-font-semibold'>{label}</div>
            <div className='tw-flex tw-gap-1 tw-flex-col'>
                <label className='tw-w-fit'>{t(`${label.toLowerCase()}.name`)}</label>
                <input type="text" value={guardian?.guardian_name || 'N/A'} className='tw-w-full tw-border tw-border-secondary/50 tw-bg-secondary/10 tw-rounded-md tw-px-2 tw-py-1' readOnly />
            </div>
            <div className='tw-flex tw-gap-1 tw-flex-col'>
                <label className='tw-w-fit'>{t(`${label.toLowerCase()}.occupation`)}</label>
                <input type="text" value={guardian?.occupation || 'N/A'} className='tw-w-full tw-border tw-border-secondary/50 tw-bg-secondary/10 tw-rounded-md tw-px-2 tw-py-1' readOnly />
            </div>
            <div className='tw-flex tw-gap-1 tw-flex-col'>
                <label className='tw-w-fit'>{t(`${label.toLowerCase()}.company`)}</label>
                <input type="text" value={guardian?.company_name || 'N/A'} className='tw-w-full tw-border tw-border-secondary/50 tw-bg-secondary/10 tw-rounded-md tw-px-2 tw-py-1' readOnly />
            </div>
            <EditableField
                label={t(`${label.toLowerCase()}.email`)}
                value={emailValue || ''}
                fieldName={`${label.toLowerCase()}Email`}
                type="email"
                onChange={(val: string) => onEmailChange(val)}
                onUpdate={onUpdate}
            />
            <EditableField
                label={t(`${label.toLowerCase()}.mobile`)}
                value={mobileValue || ''}
                fieldName={`${label.toLowerCase()}Mobile`}
                type="tel"
                onChange={(val: string) => onMobileChange(val)}
                onUpdate={onUpdate}
            />
            <EditableField
                label={t(`${label.toLowerCase()}.income`)}
                value={incomeValue || ''}
                fieldName={`${label.toLowerCase()}Income`}
                onChange={(val: string) => onIncomeChange(val)}
                onUpdate={onUpdate}
            />
        </>
    );
};

export default GuardianDetails; 