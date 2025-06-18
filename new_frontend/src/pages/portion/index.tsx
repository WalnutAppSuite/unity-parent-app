import type { Student } from '@/types/students'
import ProfileWrapper from '@/components/custom/ProfileWrapper'
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { useCmapFilters } from '@/hooks/useCmapList';

function Portion({ students }: { students: Student[] }) {

  const studentIds = students.map(student => student.name);

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      {students.map((student) => (
        <ProfileWrapper
          key={student.name}
          image={student.image}
          name={student.name}
          student_name={student.student_name}
          classSection={student.classSection}
          reference_number={student.reference_number}
          custom_division={student.custom_division}
          first_name={student.first_name}
          last_name={student.last_name}
          program_name={student.program_name}
          children={portionChildren(studentIds)}
        />
      ))}
    </div>
  )
}

export default Portion;

function portionChildren(studentIds: string[]) {

  const { data, isLoading } = useCmapFilters({
    type: 'portion',
    studentIds
  });

  console.log('Portion Data:', data, 'Loading:', isLoading);
  

  const { t } = useTranslation('portion');
  return (
    <div className="tw-flex tw-flex-col tw-gap-3">

      <Select>
        <SelectTrigger className="tw-full">
          <SelectValue placeholder={t('academicYear')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="tw-full">
          <SelectValue placeholder={t('unit')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      <Button className='tw-bg-secondary !tw-text-primary tw-text-4 tw-font-semibold tw-rounded-xl'>{t('button')}</Button>
    </div>
  );
}