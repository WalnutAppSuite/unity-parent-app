import { Skeleton } from "@/components/ui/skeleton";

export default function OfflinePTMCardSkeleton() {
    return (
        <div className="tw-bg-secondary tw-rounded-xl tw-p-4 tw-w-full tw-shadow-sm tw-font-sans tw-flex tw-flex-col tw-gap-2">
            <div className="tw-flex tw-items-center">
                <Skeleton className="tw-w-6 tw-h-6 tw-rounded-full tw-mr-2" />
                <Skeleton className="tw-h-4 tw-w-32 tw-rounded" />
            </div>
            <div className="tw-flex tw-items-center">
                <Skeleton className="tw-w-6 tw-h-6 tw-rounded-full tw-mr-2" />
                <Skeleton className="tw-h-4 tw-w-28 tw-rounded" />
            </div>
            <div className="tw-flex tw-items-start">
                <Skeleton className="tw-w-6 tw-h-6 tw-rounded-full tw-mr-2" />
                <Skeleton className="tw-h-4 tw-w-40 tw-rounded" />
            </div>
        </div>
    );
}