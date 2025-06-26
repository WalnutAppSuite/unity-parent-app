import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function FeeCardSkeleton() {
  return (
    <div className="tw-w-full">
      <Card className="tw-w-full tw-px-5 tw-py-3 !tw-rounded-3xl tw-flex tw-flex-col tw-gap-2">
        {/* Header */}
        <div className="tw-flex tw-items-center tw-justify-between">
          <Skeleton className="tw-h-6 tw-w-28 tw-rounded-full tw-bg-[#544DDB]/10" />
          <Skeleton className="tw-h-6 tw-w-24 tw-rounded-full tw-bg-[#544DDB]/10" />
        </div>
        {/* Amount */}
        <Skeleton className="tw-h-6 tw-w-32 tw-rounded-md tw-bg-gray-300/40" />
        {/* Fee Type */}
        <Skeleton className="tw-h-4 tw-w-20 tw-rounded-md tw-bg-gray-300/40" />
        {/* Footer */}
        <div className="tw-flex tw-items-center tw-justify-between tw-mt-2">
          <Skeleton className="tw-h-5 tw-w-16 tw-rounded-full tw-bg-gray-300/40" />
          <Skeleton className="tw-h-8 tw-w-20 tw-rounded-lg tw-bg-gray-300/40" />
        </div>
      </Card>
    </div>
  );
} 