export interface BonafideCertificate {
  academic_year: string | null;
  bonafide_pdf: string;
  creation: string;
  docstatus: number;
  idx: number;
  modified: string;
  modified_by: string;
  name: string;
  owner: string;
  reference_number: string;
  school: string;
  student: string | null;
  student_name: string;
  _assign: string | null;
  _comments: string | null;
  _liked_by: string | null;
  _user_tags: string | null;
}
export interface BonafideListResponse {
  message: BonafideCertificate[];
}