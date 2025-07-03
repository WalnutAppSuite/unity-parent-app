import { Skeleton } from '@/components/ui/skeleton';
import { useObservation } from '@/hooks/useObservation';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ObservationAccordion from '@/components/custom/observation-accordion/index';

function ClassParticipation() {
    const { t } = useTranslation("observation");
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
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="tw-w-full !tw-h-20" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="tw-text-primary tw-h-full tw-font-semibold tw-flex tw-flex-col tw-items-center">
                <div className="tw-flex tw-flex-col tw-items-center">
                    <h2 className="tw-text-[18px]">{studentName || ''}</h2>
                    <p className="tw-text-sm tw-text-primary">{t('unit')} : {selectedUnit || ''}</p>
                </div>
                <div className="tw-flex tw-flex-col tw-w-full tw-h-[60vh] tw-gap-3 tw-p-4 tw-items-center tw-justify-center">
                    <p className="tw-text-center tw-font-normal">{t('error')}</p>
                </div>
            </div>
        );
    }

    const hasData = data && Object.keys(data).length > 0;

    return (
        <div className="tw-text-primary tw-font-semibold tw-flex tw-flex-col tw-items-center">
            <div className="tw-flex tw-flex-col tw-items-center">
                <h2 className="tw-text-[18px]">{studentName || ''}</h2>
                <p className="tw-text-sm tw-text-primary">{t('unit')} : {selectedUnit || ''}</p>
            </div>
            <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-gap-3 tw-p-4">
                {hasData ? (
                    Object.entries(data || {}).map(([subject, observations]) => (
                        <ObservationAccordion
                            key={subject}
                            subject={subject}
                            observations={observations.map(obs => ({
                                ...obs,
                                Table: obs.Table?.map(entry => ({
                                    ...entry,
                                    period_number: String(entry.period_number),
                                })),
                            }))}
                        />
                    ))
                ) : (
                    <div className="tw-text-center tw-w-full tw-h-[60vh] tw-flex tw-items-center tw-justify-center">
                        {t('no_data') || 'No data available for this student/unit.'}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ClassParticipation;