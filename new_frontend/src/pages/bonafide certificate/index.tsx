import ProfileWrapper from '@/components/custom/ProfileWrapper';
import { useTranslation } from 'react-i18next';
import type { Student } from '@/types/students';
import { useAtom } from 'jotai';
import { studentsAtom } from '@/store/studentAtoms';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useBonafideList } from '@/hooks/useBonafideList';
import { useBonafideMutation } from '@/hooks/useBonafideMutation';
import { formatDate } from '@/utils/formatDate';
import type { BonafideCertificate } from '@/types/bonafides';

interface BonafideChildProps {
  student: Student;
}

const BonafideChildComponent = ({ student }: BonafideChildProps) => {
  const { t } = useTranslation('bonafide');

  const { data: bonafideList, refetch } = useBonafideList(student.name);
  const bonafideMutation = useBonafideMutation(refetch);

  const handleBonafideGenerateClick = () => {
    bonafideMutation.mutate(student.name);
  };

  return (
    <div className="tw-flex tw-flex-col tw-gap-3">
      <Button
        className="!tw-text-secondary !tw-bg-secondary/15 tw-text-4 tw-font-semibold tw-rounded-xl" onClick={handleBonafideGenerateClick}
      >
        {(bonafideList ?? []).length > 0 ? t('regenerateButton') : t('generateButton')}
      </Button>

      {(bonafideList ?? []).length > 0 && <p className="tw-text-white tw-text-[14px] tw-opacity-90 tw-mb-2 tw-text-left tw-self-start">
        {t("bonafideHistory")}
      </p>}

      {bonafideList?.map((bonafide: any, index: number) => (
        <div key={bonafide.name || index} className="tw-mb-4">
          <div className="tw-bg-white/10 tw-rounded-lg tw-px-4 tw-py-2 tw-flex tw-items-center tw-justify-between tw-space-x-3 tw-border tw-border-white/20">
            <div className="tw-flex tw-items-center tw-space-x-3">
              <Calendar size={14} className="tw-text-white" />
              <span className="tw-font-medium tw-text-white tw-text-lg">
                {formatDate(bonafide.creation)}
              </span>
            </div>
            <a href={bonafide.bonafide_pdf} download={bonafide?.bonafide_pdf}>
              <Button
                className="tw-bg-secondary !tw-text-primary tw-text-4 tw-font-semibold tw-rounded-xl tw-mt-2"
              >
                {t('downloadButton')}
              </Button>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

function BonafideCertificate() {
  const [students] = useAtom(studentsAtom);

  return (
    <div className="tw-space-y-6 tw-max-w-md tw-mx-auto">
      {students.map((student) => {
        console.log('Rendering student:', student.id);
        return (
          <div key={student.id} className="tw-border tw-p-4 tw-rounded-md">
            <ProfileWrapper
              name={student.name}
              classSection={student.classSection}
              student_name={student.student_name}
              image={student.image}
              reference_number={student.reference_number}
              first_name={student.first_name}
              custom_division={student.custom_division}
              last_name={student.last_name}
              program_name={student.program_name}
              isLoading={false}
              children={<BonafideChildComponent student={student} />}
            />
          </div>
        );
      })}
    </div>
  );
}

export default BonafideCertificate;