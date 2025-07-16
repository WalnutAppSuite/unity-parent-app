import type { Student } from '@/types/students';
import { useAtom } from 'jotai';
import { studentsAtom } from '@/store/studentAtoms';
import { useClassDetails } from '@/hooks/useClassDetails';
import { useDetailsList } from '@/hooks/useGuardianList';
import StudentAccordion from '@/components/custom/student-accordion';
import { useTranslation } from 'react-i18next';

export default function StudentProfile() {
  const [students] = useAtom(studentsAtom);
  const { t } = useTranslation('student_profile');

  // Handle loading state
  if (!students) {
    return (
      <div className="tw-flex tw-flex-col tw-h-[80vh] tw-gap-4 tw-items-center tw-justify-center">
        <div className="tw-text-center tw-p-4 tw-text-primary/50">
          {t('studentProfile.loading')}
        </div>
      </div>
    );
  }

  // Handle empty state
  if (students.length === 0) {
    return (
      <div className="tw-flex tw-flex-col tw-h-[80vh] tw-gap-4 tw-items-center tw-justify-center">
        <div className="tw-text-center tw-p-4 tw-text-primary/50">
          {t('studentProfile.noStudents')}
        </div>
      </div>
    );
  }

  return (
    <div className="tw-flex tw-flex-col tw-gap-4 tw-p-4">
      {students.map((student) => (
        <StudentProfileWithFilters key={student.name} student={student} />
      ))}
    </div>
  );
}

function StudentProfileWithFilters({ student }: { student: Student }) {
  const { t } = useTranslation('student_profile');
  
  if (!student || !student.name) {
    return null;
  }

  const { data: classDetails, isLoading: classDetailsLoading, error: classDetailsError } = useClassDetails(student.name);

  const { data: studentDetails, isLoading: studentDetailsLoading, error: studentDetailsError } = useDetailsList(student.name);

  // Handle error states
  if (classDetailsError) {
    return (
      <div className="tw-flex tw-flex-col tw-gap-4 tw-p-4 tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg">
        <div className="tw-text-red-600 tw-font-medium">{t('studentProfile.errors.classDetails.title')}</div>
        <div className="tw-text-red-500 tw-text-sm">
          {classDetailsError instanceof Error ? classDetailsError.message : t('studentProfile.errors.classDetails.message')}
        </div>
      </div>
    );
  }

  if (studentDetailsError) {
    return (
      <div className="tw-flex tw-flex-col tw-gap-4 tw-p-4 tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg">
        <div className="tw-text-red-600 tw-font-medium">{t('studentProfile.errors.studentDetails.title')}</div>
        <div className="tw-text-red-500 tw-text-sm">
          {studentDetailsError instanceof Error ? studentDetailsError.message : t('studentProfile.errors.studentDetails.message')}
        </div>
      </div>
    );
  }


  return (
    <StudentAccordion
      isLoading={classDetailsLoading || studentDetailsLoading}
      studentName={student.student_name}
      studentId={student.name}
      referenceNumber={student.reference_number}
      firstName={student.first_name}
      lastName={student.last_name}
      programName={classDetails?.program?.program_name || ''}
      customDivision={classDetails?.division?.student_group_name || ''}
      school={classDetails?.division?.custom_school || ''}
      dateOfBirth={student.date_of_birth}
      religion={student.religion}
      caste={student.caste}
      subCaste={student.sub_caste}
      motherTongue={student.mother_tongue}
      address1={student.address1}
      address2={student.address2}
      bloodGroup={student.blood_group}
      guardians={studentDetails?.message?.guardians}
    />
  );
}

