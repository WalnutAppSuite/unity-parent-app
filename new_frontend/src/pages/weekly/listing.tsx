import { useLocation } from "react-router-dom"
import { WeeklySkeleton } from "@/components/custom/curriculum updates card/weekly/skeleton";
import Weeklycard from "@/components/custom/curriculum updates card/weekly";
import { useCmapWeekly } from '@/hooks/useCmapList';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from "react-i18next";

function WeeklyListing() {
  const location = useLocation();
  const { t } = useTranslation('weekly_listing')
  const { date, name, division } = location.state || {};
  const { data, isLoading, error } = useCmapWeekly(date, division);

  if (isLoading) {
    return (
      <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-gap-4">
        {Array.from({ length: 2 }).map((_, outerIndex) => (
          <div key={outerIndex} className="tw-flex tw-flex-col tw-items-center tw-gap-3">
            <Skeleton className="tw-w-20 tw-h-6" />
            <Skeleton className="tw-w-24 tw-h-6" />
            {Array.from({ length: 3 }).map((_, innerIndex) => (
              <WeeklySkeleton key={innerIndex} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3">
        <p className="tw-text-red-500">{t("error")}</p>
      </div>
    );
  }

  return (
    <div className="tw-text-primary tw-font-semibold tw-flex tw-flex-col tw-items-center">
      <div className="tw-flex tw-flex-col tw-items-center">
        <h2 className="tw-text-[18px]">{name || ''}</h2>
      </div>
      <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-gap-2 tw-p-4 tw-pt-0">
        {data &&
          Object.entries(data).map(([subject, items]) => (
            <div key={subject} className="tw-mb-2">
              <h3 className="tw-text-lg tw-font-semibold tw-mb-2 tw-text-center tw-text-primary">
                {subject}
              </h3>
              <div className='tw-flex tw-flex-col tw-gap-3'>
                {Object.values(items).map((item: any) => (
                  <Weeklycard key={item.name} data={item} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default WeeklyListing