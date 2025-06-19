import ProfileWrapper from '@/components/custom/ProfileWrapper';
import type { Student } from '@/types/students';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useCmapFilters } from '@/hooks/useCmapList';
import type { Unit, AcademicYear } from '@/hooks/useCmapList';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Daily({ students }: { students: Student[] }) {
  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      {students.map((student) => (
        <StudentProfileWithFilters key={student.name} student={student} />
      ))}
    </div>
  );
}

function StudentProfileWithFilters({ student }: { student: Student }) {
  const { data, isLoading, error } = useCmapFilters({ type: 'portion', studentId: student.name });

  if (error) return (
    <div className="tw-text-red-500 tw-text-center tw-p-4">
      {'An error occurred while fetching data.'}
    </div>
  );

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
      isLoading={isLoading}
      children={
        !isLoading && data ? <PortionChildren data={data} first_name={student.first_name} /> : null
      }
    />
  );
}

function PortionChildren({ data, first_name }: { data: any, first_name: string }) {
  const { t } = useTranslation('portion');
  const [selectDivision, setSelectDivision] = useState('');
  const [selectUnit, setSelectUnit] = useState('');
  const { academic_years, units } = data;
  const navigate = useNavigate();


  const handleDailyButtonClick = () => {
    navigate('/portion/list', {
      state: {
        student_name: first_name,
        division: selectDivision,
        unit: selectUnit,
      },
    });
  };

  return (
    <div className="tw-flex tw-flex-col tw-gap-3">
      {/* Academic Year Select */}
      <Select onValueChange={setSelectDivision}>
        <SelectTrigger className="tw-full">
          <SelectValue placeholder={t('academicYear')} />
        </SelectTrigger>
        <SelectContent>
          {academic_years.map((year: AcademicYear) => (
            <SelectItem key={year.academic_year} value={year.student_group}>
              {year.academic_year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Unit Select */}
      <Select onValueChange={setSelectUnit}>
        <SelectTrigger className="tw-full">
          <SelectValue placeholder={t('unit')} />
        </SelectTrigger>
        <SelectContent>
          {units.map((unit: Unit) => (
            <SelectItem key={unit.value} value={unit.value}>
              {unit.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button className="tw-bg-secondary !tw-text-primary tw-text-4 tw-font-semibold tw-rounded-xl" onClick={handleDailyButtonClick} disabled={!selectDivision || !selectUnit}>
        {t('button')}
      </Button>
    </div>
  );
}
export default Daily;
