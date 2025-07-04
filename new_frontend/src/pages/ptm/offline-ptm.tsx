import OfflinePTMCard from "@/components/custom/offline-ptm-card";
import { useLocation } from "react-router-dom";
import { useOfflinePTMLinks } from "@/hooks/usePTMLinksQuery";
import OfflinePTMCardSkeleton from "@/components/custom/offline-ptm-card/skeleton";
import { useTranslation } from "react-i18next";

function OfflinePtm() {
    const { t } = useTranslation("offline_ptm");
    const location = useLocation();
    const { schoolName, studentName } = location.state;
    const { data: offlinePTM, isLoading, error } = useOfflinePTMLinks(schoolName || "");

    if (isLoading) {
        return (
            <div className="tw-text-primary tw-font-semibold tw-flex tw-flex-col tw-items-center">
                <div className="tw-flex tw-flex-col tw-items-center">
                    <h2 className="tw-text-[18px]">{studentName || ''}</h2>
                </div>
                <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-gap-3 tw-p-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <OfflinePTMCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="tw-text-center tw-text-primary tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-start tw-gap-3">
                <h2 className="tw-text-[18px] tw-font-semibold">{studentName || ''}</h2>
                <div className="tw-text-red-500 tw-h-[80%] tw-flex tw-justify-center tw-items-center">{t('error')}</div>
            </div>
        );
    }

    if (!offlinePTM?.message || (Array.isArray(offlinePTM?.message) && offlinePTM?.message.length === 0)) {
        return (
            <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-start tw-gap-3">
                <h2 className="tw-text-[18px]">{studentName || ''}</h2>
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
                {offlinePTM?.message?.map((item: any) => (
                    <OfflinePTMCard key={item.name} data={item} />
                ))}
            </div>
        </div>
    )
}

export default OfflinePtm;