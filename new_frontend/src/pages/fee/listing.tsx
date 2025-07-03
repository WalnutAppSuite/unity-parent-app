import useFeesList from "@/hooks/useFeeList";
import useFeesSchedule from "@/hooks/useFeeSchedule";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import FeeCard from "@/components/custom/fee-card";
import { FeeCardSkeleton } from "@/components/custom/fee-card/skeleton";

function FeeListing() {
    const location = useLocation();
    const { t } = useTranslation("fee_listing");
    const { studentName, studentId, academicYear } = location?.state || {};

    const {
        data: feesData,
        isLoading: feesLoading,
        error,
    } = useFeesList(studentId, academicYear);

    const {
        data: scheduleData,
        isLoading: scheduleLoading,
        error: errorInSchedule,
    } = useFeesSchedule(studentId, academicYear);

    const isLoading = feesLoading || scheduleLoading;

    if (isLoading) {
        return <FeeListingSkeleton />;
    }

    if (error || errorInSchedule) {
        return (
            <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3">
                <p className="tw-text-red-500">{t('error')}</p>
            </div>
        );
    }

    if (!scheduleData || !feesData) {
        return (
            <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3">
                <p className="tw-text-primary/50">{t('noData')}</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="tw-text-primary tw-font-semibold tw-flex tw-flex-col tw-items-center"
        >
            <div className="tw-flex tw-flex-col tw-items-center">
                <h2 className="tw-text-[24px] tw-font-bold">{studentName || ''}</h2>
                <div className="tw-text-sm !tw-text-primary">
                    {academicYear}
                </div>
            </div>

            <FeeCards
                feesData={feesData}
                scheduleData={scheduleData}
            />
        </motion.div>
    );
}

function FeeListingSkeleton() {
    return (
        <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-gap-4">
            <div className="tw-flex tw-flex-col tw-items-center tw-gap-3">
                <Skeleton className="tw-w-32 tw-h-8" />
                <Skeleton className="tw-w-24 tw-h-6" />
            </div>
            <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-gap-3 tw-p-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <FeeCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}

function FeeCards({ feesData, scheduleData }: {
    feesData: any[],
    scheduleData: any[],
}) {
    const feesMap = feesData.reduce((acc, fee) => {
        acc[fee.payment_term] = fee;
        return acc;
    }, {} as Record<string, any>);

    return (
        <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-gap-3 tw-p-4">
            {scheduleData.map((schedule, index) => (
                <FeeCard
                    key={schedule.payment_term}
                    schedule={schedule}
                    fee={feesMap[schedule.payment_term]}
                    index={index}
                />
            ))}
        </div>
    );
}

export default FeeListing;