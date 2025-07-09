import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OtpModal from '@/components/custom/otp-modal/index';
import type { Guardian } from '@/types/students';
import GuardianDetails from '@/components/custom/guardian-details/index';
import { useSendOtpToEmail, useSendOtpToMobile, useVerifyOtpEmail, useVerifyOtpMobile } from '@/hooks/useOtp';
import { useFieldUpdate } from '@/hooks/useFieldUpdate';
import { useGuardians } from '@/hooks/useGuardians';
import { useEditValues } from '@/hooks/useEditValues';
import { useOtpModal } from '@/hooks/useOtpModal';
import { StudentAccordionSkeleton } from './Skeleton';
import { ReadOnlyFields } from './ReadOnlyFields';
import { EditableFields } from './EditableFields';
import {
    getGuardianForField,
    getOtpContactForGuardianMobileChange,
    getOtpContactForGuardianOtherField,
    getOtpContactForStudentField
} from '@/utils/otpHelpers';

interface StudentProfileCardProps {
    isLoading: boolean;
    image?: string;
    studentId: string;
    studentName: string;
    referenceNumber: string;
    firstName: string;
    lastName: string;
    programName: string;
    customDivision: string;
    school: string;
    dateOfBirth: string;
    religion: string;
    caste: string;
    subCaste: string;
    motherTongue: string;
    address1: string;
    address2: string;
    bloodGroup: string;
    guardians?: Guardian[];
    onFieldChange?: (field: string, value: string) => void;
    onSendOtp?: (fieldName: string) => Promise<void>;
}

export default function StudentAccordion({
    isLoading = true,
    image,
    studentName = 'Adarsh Tiwari',
    studentId = 'SHGD14',
    referenceNumber = 'GD14',
    school = 'Walnut School at Shivane',
    firstName = 'Adarsh',
    lastName = 'Tiwari',
    programName = '10',
    customDivision = 'B',
    dateOfBirth = '10-01-2000',
    religion = 'Hindu',
    caste = 'Brahmin',
    subCaste = 'Brahmin',
    motherTongue = 'Hindi',
    address1 = '123, Main Road, New Delhi',
    address2 = '123, Main Road, New Delhi',
    bloodGroup = 'A+',
    guardians = [],
    onSendOtp = async () => { },
}: StudentProfileCardProps) {
    const { t } = useTranslation('student_profile');
    const { mother, father } = useGuardians(guardians);
    const [editValues, setEditValues] = useEditValues(address1, address2, bloodGroup, mother, father);
    const {
        otpField, setOtpField,
        otpValue, setOtpValue,
        otpError, setOtpError,
        otpLoading, setOtpLoading
    } = useOtpModal();
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [otpDestination, setOtpDestination] = useState<'mobile' | 'email' | null>(null);
    const [otpDestinationValue, setOtpDestinationValue] = useState<string>('');
    const sendOtpToEmail = useSendOtpToEmail();
    const sendOtpToMobile = useSendOtpToMobile();
    const verifyOtpEmail = useVerifyOtpEmail();
    const verifyOtpMobile = useVerifyOtpMobile();
    const updateField = useFieldUpdate();

    const formattedDateOfBirth = dateOfBirth.split("-").reverse().join("-");


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 },
        );
        const currentElement = document.getElementById('student-accordion');
        if (currentElement) {
            observer.observe(currentElement);
        }
        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, []);

    const showSkeleton = isLoading || !isVisible;

    const handleOtpRequest = async (field: string, value: string) => {
        setOtpField(field);
        setOtpValue('');
        setOtpError('');
        let contact = null;
        if (field === 'motherMobile' || field === 'fatherMobile') {
            contact = getOtpContactForGuardianMobileChange(getGuardianForField(field, mother, father) || undefined);
        } else if (field.startsWith('mother') || field.startsWith('father')) {
            contact = getOtpContactForGuardianOtherField(getGuardianForField(field, mother, father) || undefined);
        } else {
            contact = getOtpContactForStudentField(mother, father);
        }
        if (contact) {
            setOtpDestination(contact.type as 'mobile' | 'email');
            setOtpDestinationValue(contact.value);
            if (contact.type === 'mobile') {
                await sendOtpToMobile.mutateAsync({ mobile: contact.value });
            } else {
                await sendOtpToEmail.mutateAsync({ email: contact.value });
            }
            return true;
        }
        setOtpDestination(null);
        setOtpDestinationValue('');
        setOtpField(null);
        return false;
    };

    useEffect(() => {
        setEditValues(prev => ({
            ...prev,
            motherEmail: mother?.email_address || '',
            motherMobile: mother?.mobile_number || '',
            motherIncome: mother?.annual_income || '',
            fatherEmail: father?.email_address || '',
            fatherMobile: father?.mobile_number || '',
            fatherIncome: father?.annual_income || '',
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mother, father]);

    return (
        <div id="student-accordion">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="tw-pt-12"
            >
                <Card className="!tw-bg-blue-500 !tw-rounded-3xl tw-relative tw-pb-8 tw-pt-16 tw-px-5 tw-flex tw-flex-col tw-items-center tw-shadow-xl tw-overflow-visible">
                    {/* Profile Image with Lazy Loading */}
                    <div className="tw-absolute tw--top-10 tw-left-1/2 tw--translate-x-1/2 tw-z-10">
                        {showSkeleton ? (
                            <div className="tw-w-24 tw-h-24 tw-bg-white/50 tw-rounded-3xl tw-shadow-lg tw-border-[3px] tw-border-white tw-overflow-hidden">
                                <StudentAccordionSkeleton />
                            </div>
                        ) : (
                            <>
                                {!image ? (
                                    <div className="tw-flex tw-items-center tw-justify-center tw-w-24 tw-h-24 tw-bg-white tw-text-3xl tw-rounded-3xl tw-shadow-lg tw-border-[3px] tw-border-white">
                                        {`${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()}
                                    </div>
                                ) : (
                                    <img
                                        src={image}
                                        alt={studentName}
                                        className="tw-w-24 tw-h-24 tw-object-cover tw-rounded-3xl tw-shadow-lg tw-border-[3px] tw-border-white"
                                        loading="lazy"
                                    />
                                )}
                            </>
                        )}
                    </div>
                    {/* Name, Class, and School (always visible) */}
                    <div className="tw-text-center">
                        {showSkeleton ? (
                            <StudentAccordionSkeleton />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <h2 className="tw-text-white tw-font-medium tw-text-2xl tw-mb-2">{studentName}</h2>
                                <div className="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-mb-4">
                                    <Badge className="tw-bg-white/80 !tw-text-blue-500 !tw-rounded-full tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-shadow-none">
                                        {programName}-{customDivision}
                                    </Badge>
                                    <Badge className="tw-bg-white/80 !tw-text-blue-500 !tw-rounded-full tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-shadow-none">
                                        {referenceNumber}
                                    </Badge>
                                </div>
                                <div className="tw-flex tw-gap-2 tw-flex-col tw-mb-4 tw-text-secondary">
                                    <div className="tw-flex tw-gap-1 tw-flex-col">
                                        <label htmlFor="class" className="tw-w-fit">{t('studentProfile.accordion.class')}</label>
                                        <input type="text" value={programName || 'N/A'} className="tw-w-full tw-border tw-border-secondary/50 tw-bg-secondary/10 tw-rounded-md tw-px-2 tw-py-1" readOnly />
                                    </div>
                                    <div className="tw-flex tw-gap-1 tw-flex-col">
                                        <label htmlFor="school" className="tw-w-fit">{t('studentProfile.accordion.school')}</label>
                                        <input type="text" value={school || 'N/A'} className="tw-w-full tw-border tw-border-secondary/50 tw-bg-secondary/10 tw-rounded-md tw-px-2 tw-py-1" readOnly />
                                    </div>
                                </div>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            key="expanded"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="tw-overflow-hidden tw-mt-2 tw-flex tw-flex-col tw-gap-2"
                                        >
                                            <div className='tw-w-full tw-text-secondary'>
                                                <div className='tw-w-full'>
                                                    <div className='tw-flex tw-gap-2 tw-flex-col'>
                                                        {/* Expanded details (no class/school here) */}
                                                        <ReadOnlyFields fields={[
                                                            { label: t('studentProfile.accordion.dateOfBirth'), value: formattedDateOfBirth },
                                                            { label: t('studentProfile.accordion.religion'), value: religion },
                                                            { label: t('studentProfile.accordion.caste'), value: caste },
                                                            { label: t('studentProfile.accordion.subCaste'), value: subCaste },
                                                            { label: t('studentProfile.accordion.motherTongue'), value: motherTongue },
                                                        ]} />
                                                        <EditableFields
                                                            fields={[
                                                                { label: t('studentProfile.accordion.address1'), field: 'address1' },
                                                                { label: t('studentProfile.accordion.address2'), field: 'address2' },
                                                                { label: t('studentProfile.accordion.bloodGroup'), field: 'bloodGroup' },
                                                            ]}
                                                            editValues={editValues}
                                                            setEditValues={setEditValues}
                                                            handleOtpRequest={handleOtpRequest}
                                                        />
                                                        <GuardianDetails
                                                            label="Mother"
                                                            guardian={mother}
                                                            emailValue={editValues.motherEmail}
                                                            mobileValue={editValues.motherMobile}
                                                            incomeValue={editValues.motherIncome}
                                                            onEmailChange={(val: string) => setEditValues(prev => ({ ...prev, motherEmail: val }))}
                                                            onMobileChange={(val: string) => setEditValues(prev => ({ ...prev, motherMobile: val }))}
                                                            onIncomeChange={(val: string) => setEditValues(prev => ({ ...prev, motherIncome: val }))}
                                                            onUpdate={async (field: string, value: string, _otp: string) => {
                                                                await handleOtpRequest(field, value);
                                                            }}
                                                            t={t}
                                                            onSendOtp={onSendOtp}
                                                        />
                                                        <GuardianDetails
                                                            label="Father"
                                                            guardian={father}
                                                            emailValue={editValues.fatherEmail}
                                                            mobileValue={editValues.fatherMobile}
                                                            incomeValue={editValues.fatherIncome}
                                                            onEmailChange={(val: string) => setEditValues(prev => ({ ...prev, fatherEmail: val }))}
                                                            onMobileChange={(val: string) => setEditValues(prev => ({ ...prev, fatherMobile: val }))}
                                                            onIncomeChange={(val: string) => setEditValues(prev => ({ ...prev, fatherIncome: val }))}
                                                            onUpdate={async (field: string, value: string, _otp: string) => {
                                                                await handleOtpRequest(field, value);
                                                            }}
                                                            t={t}
                                                            onSendOtp={onSendOtp}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {/* Accordion Toggle Button at the bottom */}
                                <div className="tw-flex tw-justify-center tw-items-center tw-mt-4">
                                    <motion.span
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="tw-inline-block tw-text-primary tw-bg-secondary tw-rounded-full tw-p-2"
                                        onClick={() => setIsOpen((prev) => !prev)}
                                    >
                                        <ChevronDown />
                                    </motion.span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </Card>
            </motion.div>
            <OtpModal
                open={!!otpField}
                field={otpField}
                value={editValues[otpField ?? '']}
                otp={otpValue}
                onOtpChange={setOtpValue}
                onCancel={() => setOtpField(null)}
                onVerify={async () => {
                    setOtpLoading(true);
                    setOtpError('');
                    try {
                        if (otpDestination === 'mobile') {
                            await verifyOtpMobile.mutateAsync({ otp: otpValue, mobile: otpDestinationValue });
                        } else if (otpDestination === 'email') {
                            await verifyOtpEmail.mutateAsync({ otp: otpValue, email: otpDestinationValue });
                        }
                        if (otpField) {
                            await updateField.mutateAsync({
                                fieldName: otpField,
                                value: editValues[otpField],
                                studentId: studentId,
                                guardians: guardians || [],
                                otp: otpValue
                            });
                        }
                        setOtpField(null);
                        setOtpValue('');
                    } catch (err: any) {
                        console.log('OTP Error:', err);
                        if (err?.response?.data?.message) {
                            setOtpError(err.response.data.message);
                        } else if (err?.message) {
                            try {
                                // Try to parse as JSON
                                const errorData = JSON.parse(err.message);
                                setOtpError(errorData);
                            } catch {
                                // If not JSON, wrap as generic error object
                                setOtpError({
                                    error: true,
                                    error_type: 'generic',
                                    error_message: err.message,
                                });
                            }
                        } else {
                            setOtpError({
                                error: true,
                                error_type: 'generic',
                                error_message: 'Invalid OTP or update failed',
                            });
                        }
                    } finally {
                        setOtpLoading(false);
                    }
                }}
                error={otpError}
                loading={otpLoading}
                otpDestination={otpDestination}
                otpDestinationValue={otpDestinationValue}
            />
        </div>
    );
}
