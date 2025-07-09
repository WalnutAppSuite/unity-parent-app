import type { Student } from '@/types/students';
import ProfileWrapper from '@/components/custom/ProfileWrapper';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useClassDetails } from '@/hooks/useClassDetails';
import { useAtom } from 'jotai';
import { studentsAtom } from '@/store/studentAtoms';

function Events() {
  const [students] = useAtom(studentsAtom)

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
  // Validate student data before rendering
  if (!student || !student.name) {
    return null;
  }

  const { data: classDetails, isLoading: classLoading } = useClassDetails(student.name);

  if (!classDetails || (Array.isArray(classDetails) && classDetails.length === 0) || (typeof classDetails === "object" && Object.keys(classDetails).length === 0)) {
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
      isLoading={classLoading}
      children={<EventsChildren studentId={student.name} firstName={student.first_name} />}
    />
  );
}


function EventsChildren({ studentId, firstName }: { studentId: string, firstName: string }) {

  const { t } = useTranslation('events');
  const navigate = useNavigate();

  const handleShowEvents = () => {
    navigate('/events/details', { state: { studentId, firstName } });
  }

  return (
    <div>
      <Button
        className="tw-bg-secondary tw-w-full !tw-text-primary hover:!tw-bg-secondary/80 tw-text-4 tw-font-semibold tw-rounded-xl"
        onClick={handleShowEvents}
      >
        {t('button')}
      </Button>
    </div>
  )
}

export default Events;
