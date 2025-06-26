import { usePTMLinks } from "@/hooks/usePTMLinksQuery"
import OnlinePtmLinkCard from '@/components/custom/ptm-card/index'
import { useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import PTMCardSkeleton from "@/components/custom/ptm-card/skeleton";
import { useTranslation } from "react-i18next";

function OfflinePtm() {
    const location = useLocation();
    const { studentId, studentName } = location.state;
    const { t } = useTranslation('online_ptm');
    const { data, isLoading, error } = usePTMLinks(studentId);

    if (isLoading) {
        return (
            <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-gap-3">
                <div className="tw-flex tw-flex-col tw-items-center tw-gap-2">
                    <Skeleton className="tw-w-20 tw-h-6" />
                </div>
                {Array.from({ length: 4 }).map((_, index) => (
                    <PTMCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-start tw-gap-3">
                <h2 className="tw-text-[18px]">{studentName || ''}</h2>
                <div className="tw-text-red-500 tw-h-[80%] tw-flex tw-justify-center tw-items-center">{t('error')}</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-start tw-gap-3 tw-text-primary">
                <h2 className="tw-text-[18px] tw-font-semibold">{studentName || ''}</h2>
                <div className="tw-h-[80%] tw-w-full tw-flex tw-justify-center tw-items-center">{t('noData')}</div>
            </div>
        )
    }

    return (
        <div className="tw-text-primary tw-font-semibold tw-flex tw-flex-col tw-items-center">
            <div className="tw-flex tw-flex-col tw-items-center">
                <h2 className="tw-text-[18px]">{studentName || ''}</h2>
            </div>
            <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-gap-3 tw-p-4">
                {Array.isArray(data?.message?.data) && data?.message?.data?.map((item) => (
                    <OnlinePtmLinkCard key={item.name} data={item} student_id={studentId} />
                ))}
            </div>
        </div>
    )
}

export default OfflinePtm;