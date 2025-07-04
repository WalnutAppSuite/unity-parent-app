import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import type { Student, StudentAccordionProps, FieldEditState, OTPInputProps } from '@/types/students';
import { Edit, Lock } from 'lucide-react';
import {
    guardin_address,
    guardin_address2,
    guardin_email_update,
    guardin_father_number_update,
    guardin_number_update,
    updateAnnualIncome,
    updateBloodGroup,
    useDetailsList,
} from '@/hooks/useGuardianList';

// OTP Input Component
const OTPInput: React.FC<OTPInputProps> = ({ value, length, onChange, onComplete, disabled = false }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/\D/g, '').slice(0, length);
        onChange(newValue);
        if (newValue.length === length && onComplete) {
            onComplete(newValue);
        }
    };

    return (
        <input
            type="text"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            maxLength={length}
            style={{
                width: '120px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid rgba(255,255,255,0.3)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                textAlign: 'center',
                fontSize: '16px',
                letterSpacing: '0.5em',
                fontFamily: 'monospace'
            }}
            placeholder="0000"
        />
    );
};

function StudentAccordion({
    student,
    index,
    isEditing,
    onEditStart,
    onEditAttempt,
    onStudentUpdate,
    onEditComplete
}: StudentAccordionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [fieldStates, setFieldStates] = useState<FieldEditState>({});
    const [otpValue, setOtpValue] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');
    const [statusColor, setStatusColor] = useState('');
    const [otpMessage, setOtpMessage] = useState('');

    // Try to fetch API data, but don't require it
    const { data: details_list, refetch: detailsRefetch } = useDetailsList(student.id);
    const { mutateAsync: mutateAddress } = guardin_address();
    const { mutateAsync: mutateAddress2 } = guardin_address2();
    const { mutateAsync: mutateAsyncAnnualIncome } = updateAnnualIncome();
    const { mutateAsync: mutateAsyncBloodGroup } = updateBloodGroup();
    const { mutateAsync: mutateAsyncNumber } = guardin_number_update();
    const { mutateAsync } = guardin_email_update();

    // Extract data with fallback to mock data structure
    const FatherGuardian = details_list?.data?.message?.guardians?.find?.(
        (i: any) => i?.relation === "Father"
    )?.guardian || `father_${student.id}`;

    const MotherGuardian = details_list?.data?.message?.guardians?.find?.(
        (i: any) => i?.relation === "Mother"
    )?.guardian || `mother_${student.id}`;

    const { mutateAsync: mutateAsyncFatherNumbers } = guardin_father_number_update({ FatherGuardian });

    // Use API data first, then fallback to mock data
    const MotherEmail = details_list?.data?.message?.guardians?.find?.(
        (i: any) => i?.relation === "Mother"
    )?.email_address || (student as any).custom_mothers_email || "N/A";

    const FatherEmail = details_list?.data?.message?.guardians?.find?.(
        (i: any) => i?.relation === "Father"
    )?.email_address || (student as any).custom_fathers_email || "N/A";

    const FatherMobile = details_list?.data?.message?.guardians?.find?.(
        (i: any) => i?.relation === "Father"
    )?.mobile_number || (student as any).custom_fathers_mobile || "N/A";

    const MotherMobile = details_list?.data?.message?.guardians?.find?.(
        (i: any) => i?.relation === "Mother"
    )?.mobile_number || (student as any).custom_mothers_mobile_no || "N/A";

    const MotherName = details_list?.data?.message?.guardians?.find?.(
        (i: any) => i?.relation === "Mother"
    )?.guardian_name || `${(student as any).custom_mothers_first_name || ''} ${(student as any).custom_mothers_middle_name || ''}`.trim() || "N/A";

    const FatherName = details_list?.data?.message?.guardians?.find?.(
        (i: any) => i?.relation === "Father"
    )?.guardian_name || `${(student as any).custom_fathers_middle_name || ''} ${(student as any).custom_fathers_last_name || ''}`.trim() || "N/A";

    const address_guardian = details_list?.data?.message?.address_line_1 || student.address_line_1 || "N/A";
    const address_guardian2 = details_list?.data?.message?.address_line_2 || student.address_line_2 || "N/A";
    const blood_group = details_list?.data?.message?.blood_group || student.blood_group || "N/A";

    const annuals_income = details_list?.data?.message?.guardians?.find?.(
        (i: any) => i?.relation === "Father"
    )?.annual_income || (student as any).custom_fathers_annual_income || "N/A";

    const annuals_income_mother = details_list?.data?.message?.guardians?.find?.(
        (i: any) => i?.relation === "Mother"
    )?.annual_income || (student as any).custom_mothers_annual_income || "N/A";

    // Student info with API fallback to mock data
    const studentClass = details_list?.data?.message?.class?.name || (student as any).program_name || "N/A";
    const studentSchool = details_list?.data?.message?.division?.custom_school || student.school || "N/A";
    const studentDOB = details_list?.data?.message?.date_of_birth || student.date_of_birth;
    const studentReligion = details_list?.data?.message?.religion || student.religion || "N/A";
    const studentCaste = details_list?.data?.message?.caste || student.caste || "N/A";
    const studentSubCaste = details_list?.data?.message?.sub_caste || student.sub_caste || "N/A";
    const studentMotherTongue = details_list?.data?.message?.mother_tongue || student.mother_tongue || "N/A";

    // Initialize field state
    const initializeFieldState = (fieldKey: string, currentValue: string) => {
        setFieldStates(prev => ({
            ...prev,
            [fieldKey]: {
                isEditing: true,
                value: currentValue || '',
                isSubmitting: false,
                showOTP: false
            }
        }));
    };

    // Reset field state
    const resetFieldState = (fieldKey: string) => {
        setFieldStates(prev => {
            const newState = { ...prev };
            delete newState[fieldKey];
            return newState;
        });
        setOtpValue('');
        setVerificationStatus('');
        setOtpMessage('');
    };

    // Check if any field is being edited
    const hasActiveEdits = useMemo(() => {
        return Object.values(fieldStates).some(state => state.isEditing);
    }, [fieldStates]);

    // Reset field states when switching away from this student
    useEffect(() => {
        if (!isEditing && Object.keys(fieldStates).length > 0) {
            // Clear all field editing states when this student is no longer being edited
            setFieldStates({});
            setOtpValue('');
            setVerificationStatus('');
            setOtpMessage('');
        }
    }, [isEditing, fieldStates]);

    // Date formatting utility
    const formatDate2 = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Gradient colors for cards
    function getGradientColors(index: number) {
        const colors = [
            '#9333ea, #7c3aed, #6b21a8', // purple
            '#059669, #047857, #065f46', // emerald
            '#2563eb, #1d4ed8, #1e40af', // blue
            '#ec4899, #db2777, #be185d', // pink
            '#ea580c, #dc2626, #c2410c', // orange
            '#4f46e5, #4338ca, #3730a3', // indigo
        ];
        return colors[index % colors.length];
    }

    // OTP Functions (using your exact implementation)
    const handleSubmit = useMemo(() => (id: string) => {
        if (id === "Mother") {
            const myHeaders = new Headers();
            const payload = { email_address: MotherEmail };
            myHeaders.append("Content-Type", "application/json");
            fetch("/api/method/edu_quality.public.py.walsh.studentProfile.send_otp_to_email_address", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(payload),
                redirect: "follow",
            })
                .then((response) => response.json())
                .then((result) => result.message)
                .then((message) => {
                    if (message.success) {
                        setOtpMessage(message.message);
                    } else {
                        console.log("Error ", message.error);
                    }
                })
                .catch((error) => console.log("error", error));
        }
        if (id === "Father") {
            const myHeaders = new Headers();
            const payload = { email_address: FatherEmail };
            myHeaders.append("Content-Type", "application/json");
            fetch("/api/method/edu_quality.public.py.walsh.studentProfile.send_otp_to_email_address", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(payload),
                redirect: "follow",
            })
                .then((response) => response.json())
                .then((result) => result.message)
                .then((message) => {
                    if (message.success) {
                        setOtpMessage(message.message);
                    } else {
                        console.log("Error ", message.error);
                    }
                })
                .catch((error) => console.log("error", error));
        }
    }, [MotherEmail, FatherEmail]);

    const handleMobileNumber = useMemo(() => (id: string) => {
        if (id === "Mother") {
            const myHeaders = new Headers();
            const payload = { mobile_number: MotherMobile };
            myHeaders.append("Content-Type", "application/json");
            fetch("/api/method/edu_quality.public.py.walsh.studentProfile.send_otp_to_mobile_number", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(payload),
                redirect: "follow",
            })
                .then((response) => response.json())
                .then((result) => result.message)
                .then((message) => {
                    if (message.success) {
                        setOtpMessage(message.message);
                    } else {
                        console.log("Error ", message.error);
                    }
                })
                .catch((error) => console.log("error", error));
        }
        if (id === "Father") {
            const myHeaders = new Headers();
            const payload = { mobile_number: FatherMobile };
            myHeaders.append("Content-Type", "application/json");
            fetch("/api/method/edu_quality.public.py.walsh.studentProfile.send_otp_to_mobile_number", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(payload),
                redirect: "follow",
            })
                .then((response) => response.json())
                .then((result) => result.message)
                .then((message) => {
                    if (message.success) {
                        setOtpMessage(message.message);
                    } else {
                        console.log("Error ", message.error);
                    }
                })
                .catch((error) => console.log("error", error));
        }
    }, [MotherMobile, FatherMobile]);

    // Handle field update with mock data support
    const handleFieldUpdate = async (fieldKey: string) => {
        const fieldState = fieldStates[fieldKey];
        if (!fieldState) return;

        setFieldStates(prev => ({
            ...prev,
            [fieldKey]: { ...prev[fieldKey], isSubmitting: true }
        }));

        try {
            // For mock data, update locally instead of API calls
            if (!details_list?.data?.message) {
                // Update local mock data
                const updatedData: Partial<Student> = {};

                if (fieldKey === 'custom_mothers_email') {
                    updatedData.custom_mothers_email = fieldState.value;
                } else if (fieldKey === 'custom_fathers_email') {
                    updatedData.custom_fathers_email = fieldState.value;
                } else if (fieldKey === 'custom_mothers_mobile_no') {
                    updatedData.custom_mothers_mobile_no = fieldState.value;
                } else if (fieldKey === 'custom_fathers_mobile') {
                    updatedData.custom_fathers_mobile = fieldState.value;
                } else if (fieldKey === 'address_line_1') {
                    updatedData.address_line_1 = fieldState.value;
                } else if (fieldKey === 'address_line_2') {
                    updatedData.address_line_2 = fieldState.value;
                } else if (fieldKey === 'blood_group') {
                    updatedData.blood_group = fieldState.value;
                } else if (fieldKey === 'custom_fathers_annual_income') {
                    updatedData.custom_fathers_annual_income = fieldState.value;
                } else if (fieldKey === 'custom_mothers_annual_income') {
                    updatedData.custom_mothers_annual_income = fieldState.value;
                }

                // Update parent component state
                onStudentUpdate(student.id, updatedData);

                resetFieldState(fieldKey);
                setVerificationStatus("Updated successfully!");
                setStatusColor("green");
                setTimeout(() => setVerificationStatus(""), 2000);
                return;
            }

            // Original API logic for when real data is available
            if (fieldKey === 'custom_mothers_email') {
                if (MotherMobile === "N/A") {
                    await mutateAsync({
                        name: MotherGuardian,
                        email_address: fieldState.value,
                    });
                    detailsRefetch();
                    resetFieldState(fieldKey);
                    setVerificationStatus("Updated successfully!");
                    setStatusColor("green");
                    setTimeout(() => setVerificationStatus(""), 2000);
                } else {
                    handleMobileNumber("Mother");
                    setFieldStates(prev => ({
                        ...prev,
                        [fieldKey]: { ...prev[fieldKey], showOTP: true, isSubmitting: false }
                    }));
                }
            } else if (fieldKey === 'custom_fathers_email') {
                if (FatherMobile === "N/A") {
                    await mutateAsync({
                        name: FatherGuardian,
                        email_address: fieldState.value,
                    });
                    detailsRefetch();
                    resetFieldState(fieldKey);
                    setVerificationStatus("Updated successfully!");
                    setStatusColor("green");
                    setTimeout(() => setVerificationStatus(""), 2000);
                } else {
                    handleMobileNumber("Father");
                    setFieldStates(prev => ({
                        ...prev,
                        [fieldKey]: { ...prev[fieldKey], showOTP: true, isSubmitting: false }
                    }));
                }
            } else if (fieldKey === 'custom_mothers_mobile_no') {
                if (MotherEmail === "N/A") {
                    await mutateAsyncNumber({
                        name: MotherGuardian,
                        mobile_number: fieldState.value,
                    });
                    detailsRefetch();
                    resetFieldState(fieldKey);
                    setVerificationStatus("Updated successfully!");
                    setStatusColor("green");
                    setTimeout(() => setVerificationStatus(""), 2000);
                } else {
                    handleSubmit("Mother");
                    setFieldStates(prev => ({
                        ...prev,
                        [fieldKey]: { ...prev[fieldKey], showOTP: true, isSubmitting: false }
                    }));
                }
            } else if (fieldKey === 'custom_fathers_mobile') {
                if (FatherEmail === "N/A") {
                    await mutateAsyncFatherNumbers({
                        name: FatherGuardian,
                        mobile_number: fieldState.value,
                    });
                    detailsRefetch();
                    resetFieldState(fieldKey);
                    setVerificationStatus("Updated successfully!");
                    setStatusColor("green");
                    setTimeout(() => setVerificationStatus(""), 2000);
                } else {
                    handleSubmit("Father");
                    setFieldStates(prev => ({
                        ...prev,
                        [fieldKey]: { ...prev[fieldKey], showOTP: true, isSubmitting: false }
                    }));
                }
            } else if (fieldKey === 'address_line_1') {
                await mutateAddress({
                    name: student.name,
                    address_line_1: fieldState.value,
                });
                detailsRefetch();
                resetFieldState(fieldKey);
                setVerificationStatus("Updated successfully!");
                setStatusColor("green");
                setTimeout(() => setVerificationStatus(""), 2000);
            } else if (fieldKey === 'address_line_2') {
                await mutateAddress2({
                    name: student.name,
                    address_line_2: fieldState.value,
                });
                detailsRefetch();
                resetFieldState(fieldKey);
                setVerificationStatus("Updated successfully!");
                setStatusColor("green");
                setTimeout(() => setVerificationStatus(""), 2000);
            } else if (fieldKey === 'blood_group') {
                await mutateAsyncBloodGroup({
                    name: student.name,
                    blood_group: fieldState.value,
                });
                detailsRefetch();
                resetFieldState(fieldKey);
                setVerificationStatus("Updated successfully!");
                setStatusColor("green");
                setTimeout(() => setVerificationStatus(""), 2000);
            } else if (fieldKey === 'custom_fathers_annual_income') {
                await mutateAsyncAnnualIncome({
                    name: FatherGuardian,
                    annual_income: fieldState.value,
                });
                detailsRefetch();
                resetFieldState(fieldKey);
                setVerificationStatus("Updated successfully!");
                setStatusColor("green");
                setTimeout(() => setVerificationStatus(""), 2000);
            } else if (fieldKey === 'custom_mothers_annual_income') {
                await mutateAsyncAnnualIncome({
                    name: MotherGuardian,
                    annual_income: fieldState.value,
                });
                detailsRefetch();
                resetFieldState(fieldKey);
                setVerificationStatus("Updated successfully!");
                setStatusColor("green");
                setTimeout(() => setVerificationStatus(""), 2000);
            }
        } catch (error) {
            console.error('Error updating field:', error);
            setVerificationStatus("Failed to update");
            setStatusColor("red");
            setFieldStates(prev => ({
                ...prev,
                [fieldKey]: { ...prev[fieldKey], isSubmitting: false }
            }));
        }
    };

    // Handle OTP verification (simplified for mock data)
    const handleOTPVerification = async (fieldKey: string) => {
        if (!otpValue) return;

        // For mock data, simulate successful OTP verification
        if (!details_list?.data?.message) {
            setVerificationStatus("OTP Verified!");
            setStatusColor("green");
            setTimeout(() => {
                handleFieldUpdate(fieldKey);
            }, 1000);
            return;
        }

        // Original OTP verification logic
        if (fieldKey === 'custom_mothers_email' || fieldKey === 'custom_fathers_email') {
            // Use mobile verification logic here
        } else if (fieldKey === 'custom_mothers_mobile_no' || fieldKey === 'custom_fathers_mobile') {
            // Use email verification logic here
        }
    };

    // Handle field cancel
    const handleFieldCancel = (fieldKey: string) => {
        resetFieldState(fieldKey);
    };

    // Styles
    const cardStyle = {
        background: `linear-gradient(135deg, ${getGradientColors(index)})`,
        borderRadius: '24px',
        boxShadow: isEditing ? '0 15px 35px rgba(0,0,0,0.2)' : '0 10px 25px rgba(0,0,0,0.1)',
        margin: '16px',
        marginTop: '60px',
        overflow: 'visible',
        color: 'white',
        position: 'relative' as const,
        border: isEditing ? '3px solid #fbbf24' : 'none',
        transition: 'all 0.3s ease'
    };

    const profileContainerStyle = {
        padding: '24px',
        paddingTop: '60px',
        textAlign: 'center' as const,
        position: 'relative' as const
    };

    const avatarStyle = {
        width: '120px',
        height: '120px',
        backgroundColor: 'white',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        position: 'absolute' as const,
        top: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        border: '3px solid white',
    };

    // Event handlers
    const handleCardClick = () => {
        if (!isEditing) {
            setIsExpanded(!isExpanded);
        } else {
            onEditAttempt(student.id);
        }
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isEditing) {
            onEditStart(student.id);
            setIsExpanded(true);
        } else {
            // If editing and has active edits, complete editing
            if (hasActiveEdits) {
                onEditComplete();
                setFieldStates({});
            }
        }
    };

    // Field renderer with edit capability
    const renderField = (label: string, value: string, fieldKey?: string, isEditable: boolean = false) => {
        const fieldState = fieldStates[fieldKey || ''];
        const isFieldEditing = fieldState?.isEditing;
        const canEdit = isEditable && isEditing && !isFieldEditing;

        return (
            <div style={{ marginBottom: '12px' }}>
                <div style={{
                    fontSize: '14px',
                    marginBottom: '4px',
                    textAlign: 'left',
                    marginLeft: '12px',
                    fontFamily: 'Montserrat',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <span>{label} {isFieldEditing && <Edit size={17} style={{ marginLeft: '6px' }} />}</span>
                    {canEdit && (
                        <button
                            onClick={() => fieldKey && initializeFieldState(fieldKey, value)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                        >
                            <Edit size={16} />
                        </button>
                    )}
                </div>

                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    textAlign: 'left',
                    border: isFieldEditing ? '2px solid #fbbf24' : '1px solid white',
                    transition: 'all 0.2s ease'
                }}>
                    {isFieldEditing ? (
                        <div>
                            <input
                                type="text"
                                value={fieldState.value}
                                onChange={(e) => setFieldStates(prev => ({
                                    ...prev,
                                    [fieldKey!]: { ...prev[fieldKey!], value: e.target.value }
                                }))}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'white',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    fontFamily: 'Montserrat',
                                    marginBottom: '8px'
                                }}
                                placeholder={`Enter ${label.toLowerCase()}`}
                            />

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <button
                                    onClick={() => fieldKey && handleFieldUpdate(fieldKey)}
                                    disabled={fieldState.isSubmitting || fieldState.showOTP}
                                    style={{
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '4px 12px',
                                        fontSize: '12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {fieldState.isSubmitting ? 'Updating...' : 'Update'}
                                </button>
                                <button
                                    onClick={() => fieldKey && handleFieldCancel(fieldKey)}
                                    style={{
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '4px 12px',
                                        fontSize: '12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>

                            {/* OTP Section - simplified for mock data */}
                            {fieldState.showOTP && (
                                <div style={{ marginTop: '12px' }}>
                                    <p style={{ fontSize: '12px', marginBottom: '8px', color: statusColor }}>
                                        {!details_list?.data?.message ?
                                            "Demo Mode: Enter any 4-digit code" :
                                            `OTP sent to ${fieldKey?.includes('email') ?
                                                (fieldKey.includes('mothers') ? MotherMobile : FatherMobile) :
                                                (fieldKey?.includes('mothers') ? MotherEmail : FatherEmail)
                                            } ${otpMessage}`
                                        }
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <OTPInput
                                            value={otpValue}
                                            length={4}
                                            onChange={setOtpValue}
                                        />
                                        <button
                                            onClick={() => fieldKey && handleOTPVerification(fieldKey)}
                                            style={{
                                                backgroundColor: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '6px 12px',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Verify OTP
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Status message */}
                            {verificationStatus && !fieldState.showOTP && (
                                <p style={{ fontSize: '12px', marginTop: '8px', color: statusColor }}>
                                    {verificationStatus}
                                </p>
                            )}
                        </div>
                    ) : (
                        <span style={{
                            fontWeight: '500',
                            fontFamily: 'Montserrat'
                        }}>
                            {value || '-'}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <motion.div
            initial={false}
            style={{ marginBottom: '16px', position: 'relative' }}
            whileHover={!isEditing ? { scale: 1.02 } : {}}
            transition={{ duration: 0.2 }}
        >
            <div style={cardStyle}>
                {/* Avatar */}
                <div style={avatarStyle}>
                    {student.image ? (
                        <img
                            src={student.image}
                            alt={student.first_name}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '12px',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <svg style={{ width: '50px', height: '50px', color: '#9ca3af' }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    )}
                </div>

                <div style={profileContainerStyle}>
                    {/* Edit Button */}
                    <button
                        onClick={handleEditClick}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: isEditing ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            boxShadow: isEditing ? '0 4px 12px rgba(251, 191, 36, 0.3)' : 'none'
                        }}
                    >
                        {isEditing ? <Lock size={18} /> : <Edit size={18} />}
                    </button>

                    {/* Student Name */}
                    <h2 style={{
                        fontSize: '25px',
                        fontWeight: 'bold',
                        marginBottom: '12px',
                        fontFamily: "Montserrat"
                    }}>
                        {student.first_name}
                    </h2>

                    {/* Badges */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '16px',
                        flexWrap: 'wrap'
                    }}>
                        <span style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            fontFamily: 'Montserrat'
                        }}>
                            {(student as any).program_name} - {student.custom_division}
                        </span>

                        {student.reference_number && (
                            <span style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: '500',
                                fontFamily: 'Montserrat'
                            }}>
                                {student.reference_number}
                            </span>
                        )}
                    </div>

                    {/* Basic Info */}
                    {renderField('Class', studentClass)}
                    {renderField('School', studentSchool)}

                    {/* Expandable Content */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ paddingTop: '16px' }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px',
                                        marginBottom: '20px'
                                    }}>
                                        {/* Personal Information */}
                                        {renderField('Mother Name', MotherName)}
                                        {renderField('Father Name', FatherName)}
                                        {renderField('Date of Birth', formatDate2(studentDOB))}
                                        {renderField('Religion', studentReligion)}
                                        {renderField('Caste', studentCaste)}
                                        {renderField('Sub Caste', studentSubCaste)}
                                        {renderField('Mother Tongue', studentMotherTongue)}

                                        {/* Editable Contact Information */}
                                        {renderField('Mother Email', MotherEmail, 'custom_mothers_email', true)}
                                        {renderField('Mother Mobile', MotherMobile, 'custom_mothers_mobile_no', true)}
                                        {renderField('Father Email', FatherEmail, 'custom_fathers_email', true)}
                                        {renderField('Father Mobile', FatherMobile, 'custom_fathers_mobile', true)}

                                        {/* Editable Address Information */}
                                        {renderField('Address', address_guardian, 'address_line_1', true)}
                                        {renderField('Address 2', address_guardian2, 'address_line_2', true)}

                                        {/* Medical & Financial Information */}
                                        {renderField('Blood Group', blood_group, 'blood_group', true)}
                                        {renderField('Father Annual Income', annuals_income, 'custom_fathers_annual_income', true)}
                                        {renderField('Mother Annual Income', annuals_income_mother, 'custom_mothers_annual_income', true)}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Expand/Collapse Button */}
                    <button
                        onClick={handleCardClick}
                        style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <svg
                            style={{
                                width: '20px',
                                height: '20px',
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s'
                            }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default StudentAccordion;