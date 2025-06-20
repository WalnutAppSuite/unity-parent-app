import { useLocation } from 'react-router-dom';
import DailyCard from '@/components/custom/curriculum updates card/daily/index';
import { useCmapList } from '@/hooks/useCmapList';
import { DailySkeleton } from '@/components/custom/curriculum updates card/daily/skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

function DailyListing() {
  const location = useLocation();
  const { t } = useTranslation("daily_listing");
  const { division, subject, unit, student_name } = location.state || {};
  const { data, isLoading, error } = useCmapList(subject, unit, division);

  if (isLoading) {
    return (
      <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-gap-3">
        <div className="tw-flex tw-flex-col tw-items-center tw-gap-2">
          <Skeleton className="tw-w-20 tw-h-6" />
          <Skeleton className="tw-w-24 tw-h-6" />
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <DailySkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3">
        <p className="tw-text-red-500">{t('error')}</p>
      </div>
    );
  }

  return (
    <div className="tw-text-primary tw-font-semibold tw-flex tw-flex-col tw-items-center">
      <div className="tw-flex tw-flex-col tw-items-center">
        <h2 className="tw-text-[18px]">{student_name || ''}</h2>
        <p className="tw-text-[14px]">
          {subject || ''}:{'Unit ' + unit}
        </p>
      </div>
      <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-gap-3 tw-p-4">
        {data?.map((item) => <DailyCard key={item.name} data={item} />)}
      </div>
    </div>
  );
}

export default DailyListing;
