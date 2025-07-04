export interface Student {
  name: string;
  creation: string;
  modified: string;
  modified_by: string;
  owner: string;
  docstatus: number;
  idx: number;
  enabled: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  joining_date: string;
  user: string;
  image: string;
  student_email_id: string;
  date_of_birth: string;
  blood_group: string;
  gender: string;
  nationality: string;
  address_line_1: string;
  address_line_2: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  student_name: string;
  custom_reference_number: string;
  form_code: string;
  school: string;
  first_name_marathi: string;
  last_name_marathi: string;
  form_id: string;
  program: string;
  reference_number: string;
  seeking_admission_in_class: string;
  admission_to: string;
  school_house: string;
  saral_id: string;
  tiffin_rack_no: string;
  caste: string;
  sub_caste: string;
  religion: string;
  category: string;
  mother_tongue: string;
  aadhaar_card_number: string;
  landmark: string;
  student_status: string;
  enquired_class: string;
  gr_number: string;
  gr_book_number: string;
  confirm_for_next_year: string;
  last_school_attended: string;
  birth_place: string;
  height: string;
  weight: string;
  custom_division: string;
  roll_no: string;
  transport_provider_name: string;
  custom_reason: string;
  custom_number_of_books_issued: string;
  [key: string]: any;
}
export interface FieldEditState {
  [key: string]: {
    isEditing: boolean;
    value: string;
    isSubmitting: boolean;
    showOTP: boolean;
  };
}

// StudentAccordion component props (updated)
export interface StudentAccordionProps {
  student: Student;
  index: number;
  isEditing: boolean;
  onEditStart: (studentId: string) => void;
  onEditAttempt: (studentId: string) => void;
  onStudentUpdate: (studentId: string, updatedData: Partial<Student>) => void;
  onEditComplete: () => void;
  onSuccessMessage: (message: string, studentName?: string) => void;
}

// Legacy EditableFields interface (for backward compatibility)
export interface EditableFields {
  custom_mothers_email: string;
  custom_mothers_mobile_no: string;
  custom_fathers_email: string;
  custom_fathers_mobile: string;
  address_line_1: string;
  address_line_2: string;
  blood_group: string;
  custom_fathers_annual_income: string;
  custom_mothers_annual_income: string;
}

// ActionPopup component props
export interface ActionPopupProps {
  isVisible: boolean;
  onSave: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  saveButtonText?: string;
  cancelButtonText?: string;
}

// OTP Input component props
export interface OTPInputProps {
  value: string;
  length: number;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
}

// API Response types for OTP operations
export interface OTPResponse {
  success: boolean;
  message?: string;
  error?: string;
  error_message?: string;
}

// Field types that require OTP verification
export type OTPRequiredFields = 
  | 'custom_mothers_email' 
  | 'custom_fathers_email' 
  | 'custom_mothers_mobile_no' 
  | 'custom_fathers_mobile';

// Editable field keys
export type EditableFieldKeys = 
  | 'custom_mothers_email'
  | 'custom_mothers_mobile_no'
  | 'custom_fathers_email'
  | 'custom_fathers_mobile'
  | 'address_line_1'
  | 'address_line_2'
  | 'blood_group'
  | 'custom_fathers_annual_income'
  | 'custom_mothers_annual_income';

// Verification method type
export type VerificationMethod = 'email' | 'mobile';