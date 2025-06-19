import { useLocation } from "react-router-dom"
import DailyCard from "@/components/custom/curriculum updates card/daily/index";
import { useCmapList } from "@/hooks/useCmapList";
import { DailySkeleton } from "@/components/custom/curriculum updates card/daily/skeleton";
function DailyListing() {
  const location = useLocation();
  const { division, subject, unit, student_name } = location.state || {};
  const { data, isLoading, error } = useCmapList(subject, unit, division);

  if (isLoading) {
    return (
      <div className="tw-text-center tw-p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <DailySkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="tw-text-primary tw-font-semibold tw-flex tw-flex-col tw-items-center">
      <div className="tw-flex tw-flex-col tw-items-center">
        <h2 className="tw-text-[18px]">{student_name || ''}</h2>
        <p className="tw-text-[14px]">{subject || ''}:{"Unit " + unit}</p>
      </div>
      <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-gap-2 tw-p-4">
        {data?.map((item) => (
          <DailyCard key={item.name} data={item}
          />
        ))}
      </div>
    </div>
  )
}

export default DailyListing;