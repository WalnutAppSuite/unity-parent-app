import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

// Helper function to determine if field belongs to student or guardian
const getFieldType = (fieldName: string): 'student' | 'guardian' => {
  // Student fields
  const studentFields = ['address1', 'address2', 'bloodGroup'];
  
  // Guardian fields
  const guardianFields = ['motherEmail', 'motherMobile', 'motherIncome', 'fatherEmail', 'fatherMobile', 'fatherIncome'];
  
  if (studentFields.includes(fieldName)) {
    return 'student';
  }
  
  if (guardianFields.includes(fieldName)) {
    return 'guardian';
  }
  
  // Default to student for unknown fields
  return 'student';
};

// Helper function to get guardian ID by relation
const getGuardianIdByRelation = (guardians: any[], relation: string): string | null => {
  const guardian = guardians?.find(g => g.relation === relation);
  return guardian?.name || null;
};

// Helper function to map field names to API field names
const mapFieldToApiField = (fieldName: string): string => {
  const fieldMapping: { [key: string]: string } = {
    // Student fields
    'address1': 'address_line_1',
    'address2': 'address_line_2', 
    'bloodGroup': 'blood_group',
    
    // Guardian fields
    'motherEmail': 'email_address',
    'motherMobile': 'mobile_number',
    'motherIncome': 'annual_income',
    'fatherEmail': 'email_address',
    'fatherMobile': 'mobile_number',
    'fatherIncome': 'annual_income',
  };
  
  return fieldMapping[fieldName] || fieldName;
};

interface FieldUpdateParams {
  fieldName: string;
  value: string;
  studentId: string;
  guardians: any[];
  otp: string;
}

export const useFieldUpdate = () => {
  return useMutation({
    mutationFn: async ({ fieldName, value, studentId, guardians, otp }: FieldUpdateParams) => {
      const fieldType = getFieldType(fieldName);
      const apiFieldName = mapFieldToApiField(fieldName);

      if (fieldType === 'student') {
        // Update student field
        const payload = {
          name: studentId,
          [apiFieldName]: value,
        };
        
        const response = await axiosInstance.put(`/api/resource/Student/${studentId}`, payload);
        return response.data;
      } else {
        // Update guardian field
        let guardianId: string | null = null;
        let relation: string = '';

        // Determine which guardian to update based on field name
        if (fieldName.startsWith('mother')) {
          guardianId = getGuardianIdByRelation(guardians, 'Mother');
          relation = 'Mother';
        } else if (fieldName.startsWith('father')) {
          guardianId = getGuardianIdByRelation(guardians, 'Father');
          relation = 'Father';
        }

        if (!guardianId) {
          throw new Error(`Guardian not found for relation: ${relation}`);
        }

        const payload = {
          name: guardianId,
          [apiFieldName]: value,
        };

        const response = await axiosInstance.put(`/api/resource/Guardian/${guardianId}`, payload);
        return response.data;
      }
    },
  });
}; 