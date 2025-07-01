import ProfileWrapper from '@/components/custom/ProfileWrapper';
import { studentsAtom } from '@/store/studentAtoms';
import type { Student } from '@/types/students';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function SchoolCalendar() {

  const [students] = useAtom(studentsAtom);

  if (!students) {
    return <div>Loading...</div>;
  }

  if (!students || students.length === 0) {
    return (
      <div className="tw-flex tw-flex-col tw-gap-4">
        <div className="tw-text-center tw-p-4 tw-text-primary/50">
          No students available
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

  const { t } = useTranslation('school_calendar');
  const navigate = useNavigate();

  if (!student || !student.name) {
    return null;
  }

  return (
    <ProfileWrapper
      image={student.image}
      name={student.name}
      student_name={student.student_name}
      classSection={student.classSection}
      reference_number={student.reference_number}
      custom_division={student.custom_division}
      first_name={student.first_name}
      last_name={student.last_name}
      program_name={student.program_name}
      isLoading={false}
      children={<>
        <button className='tw-w-full tw-bg-secondary tw-text-primary tw-p-2 tw-rounded-xl' onClick={() => navigate('/school-calendar', { state: { school: student.school } })}>{t('show_calendar')}</button>
      </>}
    />
  );
}
