import type { Notice } from '@/types/notice';

/**
 * Normalizes a notice object to ensure all required fields are present with default values
 * This handles cases where the API response doesn't include all fields for every notice
 */
export function normalizeNotice(notice: Partial<Notice>): Notice {
  return {
    name: notice.name || '',
    subject: notice.subject || '',
    notice: notice.notice || '',
    creation: notice.creation || '',
    modified: notice.modified || '',
    modified_by: notice.modified_by || '',
    owner: notice.owner || '',
    docstatus: notice.docstatus ?? 0,
    idx: notice.idx ?? 0,
    type_of_notifications: notice.type_of_notifications || '',
    html: notice.html || null,
    student: notice.student || '',
    student_first_name: notice.student_first_name || '',
    student_status: notice.student_status || '',
    school: notice.school || '',
    class: notice.class || '',
    division: notice.division || null,
    academic_year: notice.academic_year || '',
    is_generic_notice: notice.is_generic_notice ?? 0,
    is_raw_html: notice.is_raw_html ?? 0,
    // Default values for status fields that might be missing
    is_read: notice.is_read ?? 0,
    is_archived: notice.is_archived ?? 0,
    is_stared: notice.is_stared ?? 0,
    test: notice.test || null,
    _user_tags: notice._user_tags || null,
    _comments: notice._comments || null,
    _assign: notice._assign || null,
    _liked_by: notice._liked_by || null,
  };
}

/**
 * Normalizes an array of notices
 */
export function normalizeNotices(notices: Partial<Notice>[]): Notice[] {
  return notices.map(normalizeNotice);
}

/**
 * Normalizes a notice list response from the API
 */
export function normalizeNoticeListResponse(response: any) {
  if (!response?.message?.notices) {
    return response;
  }

  return {
    ...response,
    message: {
      ...response.message,
      notices: normalizeNotices(response.message.notices),
    },
  };
} 