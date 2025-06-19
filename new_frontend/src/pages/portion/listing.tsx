import { useLocation } from 'react-router-dom';
import { PortionSkeleton } from '@/components/custom/curriculum updates card/portion/skeleton';
import PortionCard from '@/components/custom/curriculum updates card/portion';
import { useCmapPortion } from '@/hooks/useCmapList';

function PortionListing() {
  const location = useLocation();
  const { student_name, division, unit } = location.state || {};

  const { data, isLoading, error } = useCmapPortion(unit, division);

  console.log('PortionListing data:', data);

  if (isLoading) {
    return (
      <div className="tw-text-primary tw-font-semibold tw-flex tw-flex-col tw-items-center">
        <div className="tw-flex tw-flex-col tw-items-center">
          <h2 className="tw-text-[18px]">{student_name || ''}</h2>
        </div>
        <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-gap-2 tw-p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <PortionSkeleton key={index} />
          ))}
        </div>
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
                  {subject} : Unit {unit}
                </h3>
                <div className='tw-flex tw-flex-col tw-gap-3'>
                {Object.entries(data[subject]).map(([textbook]) => (
                  <PortionCard
                  key={textbook}
                  item={data[subject][textbook]}
                  subject={subject}
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
