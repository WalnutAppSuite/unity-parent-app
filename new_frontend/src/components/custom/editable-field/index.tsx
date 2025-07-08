import { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface EditableFieldProps {
    label: string;
    value: string;
    fieldName: string;
    isEditable?: boolean;
    onUpdate: (fieldName: string, value: string, otp: string) => Promise<void>;
    onSendOtp?: (fieldName: string) => Promise<void>;
    type?: 'text' | 'email' | 'tel';
    placeholder?: string;
    className?: string;
    onChange?: (value: string) => void;
}

export default function EditableField({
    label,
    value,
    fieldName,
    isEditable = true,
    onUpdate,
    onSendOtp,
    type = 'text',
    placeholder,
    className = '',
    onChange = () => { }
}: EditableFieldProps) {
    const { t } = useTranslation('student_profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [originalValue, setOriginalValue] = useState(value);

    const handleEdit = () => {
        setOriginalValue(value);
        setIsEditing(true);
    };

    const handleCancel = () => {
        onChange(originalValue);
        setIsEditing(false);
    };

    const handleUpdate = async () => {
        if (value === originalValue) {
            handleCancel();
            return;
        }
        setIsLoading(true);
        try {
            if (onSendOtp) {
                await onSendOtp(fieldName);
            } else {
                await onUpdate(fieldName, value, '');
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to get display value
    const getDisplayValue = (val: string) => {
        return val || 'N/A';
    };

    if (!isEditable) {
        return (
            <div className={`tw-flex tw-gap-1 tw-flex-col ${className}`}>
                <div className='tw-flex tw-items-center tw-justify-between tw-mb-1'>
                    <label className='tw-w-fit'>{label}</label>
                </div>
                <input
                    type={type}
                    value={getDisplayValue(value)}
                    className='tw-w-full tw-border tw-border-secondary/50 tw-bg-secondary/10 tw-rounded-md tw-px-2 tw-py-1'
                    readOnly
                />
            </div>
        );
    }

    if (!isEditing) {
        return (
            <div className={`tw-flex tw-gap-1 tw-flex-col ${className}`}>
                <div className='tw-flex tw-items-center tw-justify-between'>
                    <label className='tw-w-fit'>{label}</label>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleEdit}
                        className="tw-bg-none !tw-hover:tw-bg-none"
                    >
                        <Edit />
                    </Button>
                </div>
                <input
                    type={type}
                    value={getDisplayValue(value)}
                    className='tw-w-full tw-border tw-border-secondary/50 tw-bg-secondary/10 tw-rounded-md tw-px-2 tw-py-1'
                    readOnly
                />
            </div>
        );
    }

    return (
        <div className={`tw-flex tw-gap-1 tw-flex-col ${className}`}>
            <label className='tw-w-fit tw-mb-1'>{label}</label>
            <Input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className='tw-w-full'
            />
            <div className='tw-flex tw-gap-2 tw-mt-2'>
                <Button
                    size="sm"
                    onClick={handleUpdate}
                    disabled={isLoading || value === originalValue}
                    className="tw-text-xs tw-bg-secondary !tw-text-primary"
                >
                    {t('studentProfile.actions.update')}
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="tw-text-xs tw-bg-primary tw-text-secondary tw-border-none"
                >
                    {t('studentProfile.actions.cancel')}
                </Button>
            </div>
        </div>
    );
} 