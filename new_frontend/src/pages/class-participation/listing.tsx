import { Skeleton } from '@/components/ui/skeleton';
import { useObservation } from '@/hooks/useObservation';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ClassParticipation() {
    const { t } = useTranslation("");
    const location = useLocation();
    const { studentId, selectedUnit, studentName } = location.state || {};

    const { data, isLoading, error } = useObservation(studentId, selectedUnit);

    if (isLoading) {
        return (
            <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-gap-3">
                <div className="tw-flex tw-flex-col tw-items-center tw-gap-2">
                    <Skeleton className="tw-w-20 tw-h-6" />
                    <Skeleton className="tw-w-24 tw-h-6" />
                </div>
                {Array.from({ length: 4 }).map((_, index) => (
                    <></>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="tw-text-center tw-h-full tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3">
                <p className="tw-text-red-500">{t('error')}</p>
            </div>
        );
    }

    return (
        <div className="tw-text-primary tw-font-semibold tw-flex tw-flex-col tw-items-center">
            <div className="tw-flex tw-flex-col tw-items-center">
                <h2 className="tw-text-[18px]">{studentName || ''}</h2>
            </div>
            <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-gap-3 tw-p-4">

            </div>
        </div>
    )
}

export default ClassParticipation;