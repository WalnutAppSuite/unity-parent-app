import ProfileWrapper from "@/components/custom/ProfileWrapper";
import { useClassDetails } from "@/hooks/useClassDetails";
import { studentsAtom } from "@/store/studentAtoms";
import { useAtom } from "jotai";
import type { Student } from "@/types/students";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

function Timetable() {
  const [students] = useAtom(studentsAtom);

  return (
    <div className="tw-p-4">
      {students.map((student) => (
        <StudentProfileWithFilters key={student.name} student={student} />
      ))}
    </div>
  )
}

export default Timetable;

function StudentProfileWithFilters({ student }: { student: Student }) {

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
      children={<TimetableChild division={classDetails?.division?.name} studentName={student?.first_name} />}
    />
  );
}

function TimetableChild({ division, studentName }: { division: string | undefined, studentName: string }) {

  const navigate = useNavigate();
  const { t } = useTranslation('timetable');

  const handleTimetableClick = () => {
    navigate('/timetable/detailed', { state: { division, studentName } });
  }

  return <div>
    <Button
      className="tw-bg-secondary tw-w-full !tw-text-primary tw-text-4 tw-font-semibold tw-rounded-xl"
      onClick={handleTimetableClick}
    >
      {t('button')}
    </Button>
  </div>;
}