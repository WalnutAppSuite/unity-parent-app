import type { Student } from '@/types/students';
import ProfileWrapper from '@/components/custom/ProfileWrapper';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/custom/date picker';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';
import { useClassDetails } from '@/hooks/useClassDetails';

function Weekly({ students }: { students: Student[] }) {
  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      {students.map((student) => (
        <StudentProfileWithFilters key={student.name} student={student} />
      ))}
    </div>
  );
}

function StudentProfileWithFilters({ student }: { student: Student }) {

  const { data: classDetails, isLoading : classLoading } = useClassDetails(student.name);

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
      children={<WeeklyChildren name={student.first_name} division={classDetails.division.name}/>}
    />
  );
}


function WeeklyChildren({ name , division }: { name: string , division: string }) {
  const { t } = useTranslation('weekly');
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const navigate = useNavigate();

  function formatDateRange(date: DateRange | undefined): string {
    if (!date?.from || !date?.to) return '';
    const from = date.from.toISOString().slice(0, 10);
    const to = date.to.toISOString().slice(0, 10);
    return `${from},${to}`;
  }

  const handleWeeklyButtonClick = () => {
    if (date?.from && date?.to) {
      const formatted = formatDateRange(date);
      console.log('Selected Date Range:', formatted);

      navigate('/weekly/list', { state: { date: formatted , name , division } });
    }
  };

  return (
    <div className="tw-flex tw-flex-col tw-gap-3">
      <DateRangePicker
        className="tw-w-full"
        value={date}
        onChange={(range: DateRange | undefined) => setDate(range)}
      />
      <Button
        className="tw-bg-secondary !tw-text-primary tw-text-4 tw-font-semibold tw-rounded-xl"
        disabled={!date?.from || !date?.to}
        onClick={handleWeeklyButtonClick}
      >
        {t('button')}
      </Button>
    </div>
  );
}

export default Weekly;
