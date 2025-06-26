import ProfileWrapper from "@/components/custom/ProfileWrapper";
import { studentsAtom } from "@/store/studentAtoms";
import { useAtom } from "jotai";
import type { Student } from "@/types/students";
import { useClassDetails } from "@/hooks/useClassDetails";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUnits } from "@/hooks/useUnit";
import type { Unit } from "@/hooks/useUnit"
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Observation() {
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
  const { data: unitData, isLoading: unitLoading } = useUnits();

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
      isLoading={classLoading || unitLoading}
      children={<ObservationChild studentId={student.name} unitData={unitData} studentName={student.first_name} />}
    />
  );
}

function ObservationChild({ studentId, unitData, studentName }: { studentId: string, unitData: Unit[] | undefined, studentName: string }) {
  const { t } = useTranslation('class_participation')
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>();
  const navigate = useNavigate();

  const handleObservationCLick = () => {
    navigate('/observation/list', { state: { studentId, selectedUnit, studentName } })
  }

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Select value={selectedUnit} onValueChange={setSelectedUnit}>
        <SelectTrigger className="tw-w-full">
          <SelectValue placeholder={t('unitPlaceHolder')} />
        </SelectTrigger>
        <SelectContent>
          {Array.isArray(unitData) && unitData?.map((item) => (
            <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="tw-bg-secondary !tw-text-primary tw-text-4 tw-font-semibold tw-rounded-xl"
        disabled={!selectedUnit}
        onClick={handleObservationCLick}
      >
        {t('button')}
      </Button>
    </div>
  )
}

export default Observation