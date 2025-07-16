import type { Guardian } from '@/types/students';

// Returns the guardian object for a given field name
export function getGuardianForField(field: string, mother: Guardian | undefined, father: Guardian | undefined) {
    if (field.startsWith('mother')) return mother;
    if (field.startsWith('father')) return father;
    return null;
}

// For guardian mobile number change: prefer email, fallback to old mobile
export function getOtpContactForGuardianMobileChange(guardian: Guardian | undefined) {
    if (guardian?.email_address) return { type: 'email', value: guardian.email_address };
    if (guardian?.mobile_number) return { type: 'mobile', value: guardian.mobile_number };
    return null;
}

// For other guardian fields: prefer mobile, fallback to email
export function getOtpContactForGuardianOtherField(guardian: Guardian | undefined) {
    if (guardian?.mobile_number) return { type: 'mobile', value: guardian.mobile_number };
    if (guardian?.email_address) return { type: 'email', value: guardian.email_address };
    return null;
}

// For student fields: try father's mobile, mother's mobile, father's email, mother's email
export function getOtpContactForStudentField(mother: Guardian | undefined, father: Guardian | undefined) {
    if (father?.mobile_number) return { type: 'mobile', value: father.mobile_number };
    if (mother?.mobile_number) return { type: 'mobile', value: mother.mobile_number };
    if (father?.email_address) return { type: 'email', value: father.email_address };
    if (mother?.email_address) return { type: 'email', value: mother.email_address };
    return null;
} 