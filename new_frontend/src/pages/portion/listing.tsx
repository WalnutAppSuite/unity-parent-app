import { useLocation } from 'react-router-dom';
import { PortionSkeleton } from '@/components/custom/curriculum-updates-card/portion/skeleton';
import PortionCard from '@/components/custom/curriculum-updates-card/portion';
import { useCmapPortion } from '@/hooks/useCmapList';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';

function PortionListing() {
  const location = useLocation();
  const { t } = useTranslation("portion_listing")
  const { student_name, division, unit } = location.state || {};
  const { data, isLoading, error } = useCmapPortion(unit, division);

  if (isLoading) {
    return (
      <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-gap-4">
        {Array.from({ length: 2 }).map((_, outerIndex) => (
          <div key={outerIndex} className="tw-flex tw-flex-col tw-items-center tw-gap-3">
            <Skeleton className="tw-w-20 tw-h-6" />
            <Skeleton className="tw-w-24 tw-h-6" />
            {Array.from({ length: 3 }).map((_, innerIndex) => (
              <PortionSkeleton key={innerIndex} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-text-center tw-text-primary tw-font-semibold tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-start tw-gap-3">
        <div className="tw-flex tw-flex-col tw-items-center">
          <h2 className="tw-text-[18px]">{student_name || ''}</h2>
        </div>
        <div className="tw-text-red-500 tw-font-normal tw-w-full tw-text-center tw-flex tw-justify-center tw-items-center tw-items-center tw-justify-center tw-h-[80%]">{t('error')}</div>
      </div>
    )
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="tw-text-center tw-h-full tw-text-primary tw-font-semibold tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-start tw-gap-3">
        <div className="tw-flex tw-flex-col tw-items-center">
          <h2 className="tw-text-[18px]">{student_name || ''}</h2>
        </div>
        <div className="tw-w-full tw-font-normal tw-text-center tw-flex tw-justify-center tw-items-center tw-items-center tw-justify-center tw-h-[80%]">{t('noData')}</div>
      </div>
    );
  }

  return (
    <div className="tw-text-primary tw-font-semibold tw-flex tw-flex-col tw-items-center">
      <div className="tw-flex tw-flex-col tw-items-center">
        <h2 className="tw-text-[18px]">{student_name || ''}</h2>
      </div>
      <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-gap-2 tw-p-4 tw-pt-0">
        <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-gap-2">
          {data &&
            Object.entries(data).map(([subject]) => (
              <div key={subject} className="tw-mb-2">
                <h3 className="tw-text-lg tw-font-semibold tw-mb-2 tw-text-center tw-text-primary">
                  {subject} : {t('unit')} {unit}
                </h3>
                <div className='tw-flex tw-flex-col tw-gap-3'>
                  {Object.entries(data[subject]).map(([textbook]) => (
                    <PortionCard
                      key={textbook}
                      item={data[subject][textbook]}
                      textbook={textbook}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default PortionListing;
