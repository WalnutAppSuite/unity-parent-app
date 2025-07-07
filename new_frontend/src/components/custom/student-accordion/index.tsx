import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EditableField from '@/components/custom/editable-field';
import OtpModal from '@/components/custom/otp-modal/index';
import type { Guardian } from '@/types/students';
import GuardianDetails from '@/components/custom/guardian-details/index';
import { useSendOtpToEmail, useSendOtpToMobile, useVerifyOtpEmail, useVerifyOtpMobile } from '@/hooks/useOtp';

interface StudentProfileCardProps {
    isLoading: boolean;
    image?: string;
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
    onUpdateField?: (fieldName: string, value: string, otp: string) => Promise<void>;
    onSendOtp?: (fieldName: string) => Promise<void>;
}

export default function StudentAccordion({
    isLoading = true,
    image,
    studentName = 'Adarsh Tiwari',
    referenceNumber = 'GD14',
    firstName = 'Adarsh',
    lastName = 'Tiwari',
    programName = '10',
    customDivision = 'B',
    school = 'School Name',
    dateOfBirth = '10-01-2000',
    religion = 'Hindu',
    caste = 'Brahmin',
    subCaste = 'Brahmin',
    motherTongue = 'Hindi',
    address1 = '123, Main Road, New Delhi',
    address2 = '123, Main Road, New Delhi',
    bloodGroup = 'A+',
    guardians = [],
    onUpdateField = async () => { },
    onSendOtp = async () => { },
}: StudentProfileCardProps) {
    const { t } = useTranslation('student_profile');

    // Helper functions to extract guardian data
    const getGuardianByRelation = (relation: string) => {
        return guardians?.find(guardian => guardian.relation === relation);
    };

    const mother = getGuardianByRelation('Mother');
    const father = getGuardianByRelation('Father');

    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [editValues, setEditValues] = useState<{
        [key: string]: string;
        address1: string;
        address2: string;
        bloodGroup: string;
        motherEmail: string;
        motherMobile: string;
        motherIncome: string;
        fatherEmail: string;
        fatherMobile: string;
        fatherIncome: string;
    }>({
        address1,
        address2,
        bloodGroup,
        motherEmail: mother?.email_address || '',
        motherMobile: mother?.mobile_number || '',
        motherIncome: mother?.annual_income || '',
        fatherEmail: father?.email_address || '',
        fatherMobile: father?.mobile_number || '',
        fatherIncome: father?.annual_income || '',
    });

    const [otpField, setOtpField] = useState<string | null>(null);
    const [otpValue, setOtpValue] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    // Add state for OTP destination
    const [otpDestination, setOtpDestination] = useState<'mobile' | 'email' | null>(null);
    const [otpDestinationValue, setOtpDestinationValue] = useState<string>('');

    const sendOtpToEmail = useSendOtpToEmail();
    const sendOtpToMobile = useSendOtpToMobile();
    const verifyOtpEmail = useVerifyOtpEmail();
    const verifyOtpMobile = useVerifyOtpMobile();

    // Use IntersectionObserver for lazy loading
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

    // Decide whether to show skeleton or content
    const showSkeleton = isLoading || !isVisible;

    const handleOtpRequest = async (field: string, value: string) => {
        setOtpField(field);
        setOtpValue('');
        setOtpError('');

        // Direct contact fields
        if (field === 'motherMobile' || field === 'fatherMobile') {
            setOtpDestination('mobile');
            setOtpDestinationValue(value);
            await sendOtpToMobile.mutateAsync({ mobile: value });
            return true;
        }
        if (field === 'motherEmail' || field === 'fatherEmail') {
            setOtpDestination('email');
            setOtpDestinationValue(value);
            await sendOtpToEmail.mutateAsync({ email: value });
            return true;
        }

        // For other fields, try fallback order: father's mobile, mother's mobile, father's email, mother's email
        if (father?.mobile_number) {
            setOtpDestination('mobile');
            setOtpDestinationValue(father.mobile_number);
            await sendOtpToMobile.mutateAsync({ mobile: father.mobile_number });
            return true;
        }
        if (mother?.mobile_number) {
            setOtpDestination('mobile');
            setOtpDestinationValue(mother.mobile_number);
            await sendOtpToMobile.mutateAsync({ mobile: mother.mobile_number });
            return true;
        }
        if (father?.email_address) {
            setOtpDestination('email');
            setOtpDestinationValue(father.email_address);
            await sendOtpToEmail.mutateAsync({ email: father.email_address });
            return true;
        }
        if (mother?.email_address) {
            setOtpDestination('email');
            setOtpDestinationValue(mother.email_address);
            await sendOtpToEmail.mutateAsync({ email: mother.email_address });
            return true;
        }
        // No contact found, do not show modal
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
                                <Skeleton className="tw-w-full tw-h-full" />
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



                    {/* Name and Badges */}
                    <div className="tw-text-center">
                        {showSkeleton ? (
                            <div className="tw-flex tw-flex-col tw-items-center tw-space-y-4">
                                <Skeleton className="tw-w-40 tw-h-8 tw-rounded-lg tw-bg-white/30" />
                                <div className="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-mb-4">
                                    <Skeleton className="tw-w-16 tw-h-6 tw-rounded-full tw-bg-white/30" />
                                    <Skeleton className="tw-w-16 tw-h-6 tw-rounded-full tw-bg-white/30" />
                                </div>
                                <Skeleton className="tw-w-full tw-h-32 tw-rounded-lg tw-bg-white/20" />
                            </div>
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

                                {/* Accordion Body */}
                                <div className='tw-w-full tw-text-secondary'>
                                    <div className='tw-w-full'>
                                        <div className='tw-flex tw-gap-2 tw-flex-col'>
                                            <div className='tw-flex tw-gap-1 tw-flex-col'>
                                                <label htmlFor="class" className='tw-w-fit'>{t('studentProfile.accordion.class')}</label>
                                                <input type="text" value={programName} className='tw-w-full tw-border tw-border-secondary/50 tw-bg-secondary/10 tw-rounded-md tw-px-2 tw-py-1' readOnly />
                                            </div>
                                            <div className='tw-flex tw-gap-1 tw-flex-col'>
                                                <label htmlFor="school" className='tw-w-fit'>{t('studentProfile.accordion.school')}</label>
                                                <input type="text" value={school} className='tw-w-full tw-border tw-border-secondary/50 tw-bg-secondary/10 tw-rounded-md tw-px-2 tw-py-1' readOnly />
                                            </div>
                                        </div>

                                        {/* AnimatePresence for accordion */}
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
                                                    {/* Read-only fields */}
                                                    <div className='tw-flex tw-gap-1 tw-flex-col'>
                                                        {[
                                                            { label: t('studentProfile.accordion.dateOfBirth'), value: dateOfBirth },
                                                            { label: t('studentProfile.accordion.religion'), value: religion },
                                                            { label: t('studentProfile.accordion.caste'), value: caste },
                                                            { label: t('studentProfile.accordion.subCaste'), value: subCaste },
                                                            { label: t('studentProfile.accordion.motherTongue'), value: motherTongue },
                                                        ].map(({ label, value }, idx) => (
                                                            <div className='tw-flex tw-gap-1 tw-flex-col' key={idx}>
                                                                <label className='tw-w-fit'>{label}</label>
                                                                <input type="text" value={value} className='tw-w-full tw-border tw-border-secondary/50 tw-bg-secondary/10 tw-rounded-md tw-px-2 tw-py-1' readOnly />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {/* Editable fields: Address 1, 2, Blood Group */}
                                                    {[
                                                        { label: t('studentProfile.accordion.address1'), field: 'address1' },
                                                        { label: t('studentProfile.accordion.address2'), field: 'address2' },
                                                        { label: t('studentProfile.accordion.bloodGroup'), field: 'bloodGroup' },
                                                    ].map(({ label, field }) => (
                                                        <EditableField
                                                            key={field}
                                                            label={label}
                                                            value={editValues[field]}
                                                            fieldName={field}
                                                            onChange={(val: string) => setEditValues(prev => ({ ...prev, [field]: val }))}
                                                            onUpdate={async (field: string, value: string, _otp: string) => {
                                                                await handleOtpRequest(field, value);
                                                            }}
                                                        />
                                                    ))}
                                                    {/* Mother's Details */}
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
                                                    {/* Father's Details */}
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
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Expand/Collapse Button */}
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
                                    </div>
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
                        await onUpdateField(otpField!, editValues[otpField!], otpValue);
                        setOtpField(null);
                        setOtpValue('');
                    } catch (err) {
                        setOtpError('Invalid OTP');
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
