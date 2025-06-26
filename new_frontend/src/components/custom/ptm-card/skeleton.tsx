import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PTMCardSkeleton = () => {
  return (
    <div className="tw-w-full">
      <Card className="tw-w-full tw-px-5 tw-py-4 !tw-rounded-3xl tw-flex tw-flex-col tw-gap-4">
        <div className="tw-space-y-4">
          {/* Date Row */}
          <div className="tw-flex tw-items-center tw-gap-3">
            <Skeleton className="tw-w-5 tw-h-5 tw-rounded-full" />
            <Skeleton className="tw-h-4 tw-w-3/5" />
          </div>

          {/* Time Row */}
          <div className="tw-flex tw-items-center tw-gap-3">
            <Skeleton className="tw-w-5 tw-h-5 tw-rounded-full" />
            <Skeleton className="tw-h-4 tw-w-2/4" />
          </div>

          {/* Subject Row */}
          <div className="tw-flex tw-items-center tw-gap-3">
            <Skeleton className="tw-w-5 tw-h-5 tw-rounded-full" />
            <Skeleton className="tw-h-4 tw-w-2/3" />
          </div>
        </div>

        {/* Join Button */}
        <Skeleton className="tw-h-10 tw-w-full tw-rounded-xl" />
      </Card>
    </div>
  );
};

export default PTMCardSkeleton;
