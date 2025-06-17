export interface Notice {
  // Basic identification
  name: string;
  subject: string;
  notice: string; // HTML content
  
  // Timestamps
  creation: string; // ISO timestamp like "2025-05-11 15:04:05.850981"
  modified: string; // ISO timestamp
  
  // User information
  modified_by: string; // Email of modifier
  owner: string; // Email of owner
  
  // Document status
  docstatus: number; // 0 = draft, 1 = submitted, etc.
  idx: number; // Index/order
  
  // Notification details
  type_of_notifications: string; // "Everyone", "Important", etc.
  html: string | null; // Additional HTML content
  
  // Student information
  student: string; // Student ID like "SHHA26"
  student_first_name: string; // "Arush"
  student_status: string; // "Current student", etc.
  
  // School information
  school: string; // "Walnut School at Shivane"
  class: string; // "8-Oakwood Global Academy"
  division: string | null; // Division/section
  academic_year: string; // "2025-2026"
  
  // Flags (using numbers as booleans from API)
  is_generic_notice: number; // 0 or 1
  is_raw_html: number; // 0 or 1
  is_read: number; // 0 or 1
  is_archived: number; // 0 or 1
  is_stared: number; // 0 or 1
  
  // Optional fields
  test: string | null;
  
  // System fields (Frappe framework)
  _user_tags: string | null;
  _comments: string | null;
  _assign: string | null;
  _liked_by: string | null;
}
