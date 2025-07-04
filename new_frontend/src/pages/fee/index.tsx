import ProfileWrapper from "@/components/custom/ProfileWrapper";
import { studentsAtom } from "@/store/studentAtoms";
import { useAtom } from "jotai";
import type { Student } from "@/types/students";
import { useClassDetails } from "@/hooks/useClassDetails";
import useStudentAcademicYear from "@/hooks/useAcademicYear";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Fee() {
  const [students] = useAtom(studentsAtom);

  return (
    <div className="tw-p-4">
      {students.map((student) => (
        <StudentProfileWithFilters key={student.name} student={student} />
      ))}
    </div>
  )
}

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
        children={<FeeChild studentId={student.name} studentName={student.first_name} />}
      />
    </div>
  );
}

function FeeChild({ studentId, studentName }: { studentId: string, studentName: string }) {
  const [academicYear, setAcademicYear] = useState("");
  const { t } = useTranslation('fee');
  const { data } = useStudentAcademicYear(studentId);

  const navigate = useNavigate();

  const handleFeesButtonClick = () => {
    navigate('/fee/list', {
      state: {
        studentName,
        studentId,
        academicYear
      }
    })
  }

  return (
    <div className="tw-flex tw-flex-col tw-gap-3">
      <Select value={academicYear} onValueChange={setAcademicYear}>
        <SelectTrigger className="tw-w-full">
          <SelectValue placeholder={t("academicYearLable")} />
        </SelectTrigger>
        <SelectContent>
          {data?.map((item: string) => (
            <SelectItem value={item} key={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="tw-bg-secondary !tw-text-primary hover:!tw-bg-secondary/80 tw-text-4 tw-font-semibold tw-rounded-xl"
        disabled={!academicYear}
        onClick={handleFeesButtonClick}
      >
        {t('button')}
      </Button>
    </div>
  )
}
