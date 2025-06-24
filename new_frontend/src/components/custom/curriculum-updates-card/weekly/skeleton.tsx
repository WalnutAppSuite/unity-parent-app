import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function WeeklySkeleton() {
  return (
    <div className="tw-w-full">
      <Card className="tw-w-full tw-px-5 tw-py-3 !tw-rounded-3xl tw-flex tw-flex-col tw-gap-[10px]">
        {/* Header */}
        <div className="tw-flex tw-items-center tw-justify-between">
          <Skeleton className="tw-h-6 tw-w-28 tw-rounded-full tw-bg-[#544DDB]/10" />
          <Skeleton className="tw-h-6 tw-w-14 tw-rounded-full tw-bg-[#544DDB]/10" />
        </div>
        {/* Title */}
        <Skeleton className="tw-h-5 tw-w-32 tw-rounded-md tw-bg-gray-300/40" />
        {/* Doc Cards Row */}
        <div className="tw-flex tw-items-center tw-gap-2">
          <Skeleton className="tw-h-7 tw-w-24 tw-rounded-[6px] tw-bg-gray-300/40" />
          <Skeleton className="tw-h-7 tw-w-24 tw-rounded-[6px] tw-bg-gray-300/40" />
          <Skeleton className="tw-h-7 tw-w-24 tw-rounded-[6px] tw-bg-gray-300/40" />
        </div>
      </Card>
    </div>
  );
}
