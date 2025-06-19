import { useLocation } from "react-router-dom"
import { WeeklySkeleton } from "@/components/custom/curriculum updates card/weekly/skeleton";
import Weeklycard from "@/components/custom/curriculum updates card/weekly";

function WeeklyListing() {

  const location = useLocation();
  const { date, name, division } = location.state || {};

  console.log('WeeklyListing location state:', date, name, division);

  return (
    <div className="tw-text-primary tw-font-semibold tw-flex tw-flex-col tw-items-center">
      <div className="tw-flex tw-flex-col tw-items-center">
        <h2 className="tw-text-[18px]">{name || ''}</h2>
      </div>
      <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-gap-2 tw-p-4">
        <Weeklycard />
      </div>
    </div>
  )
}

export default WeeklyListing