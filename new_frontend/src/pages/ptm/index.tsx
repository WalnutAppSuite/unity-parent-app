import PTMInstruction from "@/components/custom/instruction/ptm"
import ProfileWrapper from "@/components/custom/ProfileWrapper";
import { studentsAtom } from "@/store/studentAtoms";
import { useAtom } from "jotai";
import type { Student } from "@/types/students";
import { useClassDetails } from "@/hooks/useClassDetails";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function PTM() {
  const [students] = useAtom(studentsAtom);

  return (
    <div className="tw-p-4">
      <PTMInstruction />
      {students.map((student) => (
        <StudentProfileWithFilters key={student.name} student={student} />
      ))}
    </div>
  )
}

export default PTM

function StudentProfileWithFilters({ student }: { student: Student }) {

  const { data: classDetails, isLoading: classLoading } = useClassDetails(student.name);

  if (!classDetails || (Array.isArray(classDetails) && classDetails.length === 0) || (typeof classDetails === "object" && Object.keys(classDetails).length === 0)) {
    return null;
  }

  return (
    <div>
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
        children={<PTMChild studentId={student.name} schoolName={student.school} studentName={student.first_name} />}
      />
    </div>
  );
}

function PTMChild({ studentId, schoolName, studentName }: { studentId: string, schoolName: string, studentName: string }) {

  const navigate = useNavigate();

  return (
    <div className="tw-flex tw-flex-col tw-gap-3">
      <Button className="tw-bg-secondary !tw-text-primary hover:!tw-bg-secondary/80 tw-text-4 tw-font-semibold tw-rounded-xl" onClick={() => navigate('/ptm/online', { state: { studentId, studentName } })}>Upcoming Online PTMs</Button>
      <Button className="tw-bg-secondary !tw-text-primary hover:!tw-bg-secondary/80 tw-text-4 tw-font-semibold tw-rounded-xl" onClick={() => navigate('/ptm/offline', { state: { schoolName, studentName } })}>Offline PTMs Schedule</Button>
    </div>
  )
}
