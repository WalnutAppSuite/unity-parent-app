import { Skeleton } from '@/components/ui/skeleton';

export function StudentAccordionSkeleton() {
    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-space-y-4">
            <Skeleton className="tw-w-40 tw-h-8 tw-rounded-lg tw-bg-white/30" />
            <div className="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-mb-4">
                <Skeleton className="tw-w-16 tw-h-6 tw-rounded-full tw-bg-white/30" />
                <Skeleton className="tw-w-16 tw-h-6 tw-rounded-full tw-bg-white/30" />
            </div>
            <Skeleton className="tw-w-full tw-h-32 tw-rounded-lg tw-bg-white/20" />
        </div>
    );
} 