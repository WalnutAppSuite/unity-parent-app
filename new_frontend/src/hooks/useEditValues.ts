import { useState } from 'react';
import type { Guardian } from '@/types/students';

export function useEditValues(address1: string, address2: string, bloodGroup: string, mother: Guardian | undefined, father: Guardian | undefined) {
    const [editValues, setEditValues] = useState<Record<string, string>>({
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

    return [editValues, setEditValues] as const;
} 