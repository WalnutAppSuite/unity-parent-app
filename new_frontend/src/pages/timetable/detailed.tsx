import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useTimetable } from "@/hooks/useTimetable";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { motion, animate } from "framer-motion";
import { useRef, useEffect } from "react";

function DetailedTimetable() {
    const { state } = useLocation();
    const { division, studentName } = state;

    const { data, isLoading, error } = useTimetable(division);
    const { t } = useTranslation("timetable");

    const timetable = data?.timetable || {};

    const allPeriods = Array.from(new Set(Object.keys(timetable))).sort((a, b) => Number(a) - Number(b));

    const WEEKDAYS = [
        t('days.monday', 'Monday'),
        t('days.tuesday', 'Tuesday'),
        t('days.wednesday', 'Wednesday'),
        t('days.thursday', 'Thursday'),
        t('days.friday', 'Friday'),
        t('days.saturday', 'Saturday'),
        t('days.sunday', 'Sunday'),
    ];
    const todayIndex = new Date().getDay();
    const today = WEEKDAYS[(todayIndex === 0 ? 6 : todayIndex - 1)];

    const allDaysUnsorted = Array.from(
        new Set(Object.values(timetable).flatMap(periodObj => Object.keys(periodObj || {})))
    );
    const allDays = WEEKDAYS.filter(day => allDaysUnsorted.includes(day));

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const todayCellRef = useRef<HTMLTableCellElement>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (scrollContainerRef.current && todayCellRef.current) {
                const container = scrollContainerRef.current;
                const cell = todayCellRef.current;
                const cellRect = cell.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const scrollLeft = cell.offsetLeft - containerRect.width / 2 + cellRect.width / 2;
                animate(container.scrollLeft, scrollLeft, {
                    duration: 0.8,
                    onUpdate: (latest: number) => {
                        container.scrollLeft = latest;
                    }
                });
            }
        }, 100); // 100ms delay to ensure DOM is ready
        return () => clearTimeout(timeout);
    }, [today]);

    if (isLoading) {
        return (
            <div className="tw-flex tw-flex-col tw-gap-4 tw-p-6">
                <Skeleton className="tw-w-32 tw-h-6" />
                {[...Array(4)].map((_, idx) => (
                    <Skeleton key={idx} className="tw-w-full tw-h-16" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="tw-text-center tw-h-[80vh] tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3">
                <p className="tw-text-destructive tw-font-semibold">{t("error")}</p>
            </div>
        );
    }

    if (!data?.timetable) {
        return (
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-[70vh] tw-gap-4 tw-text-primary">
                <p className="tw-font-semibold">{studentName}</p>
                <p>{t("noData")}</p>
            </div>
        );
    }

    return (
        <motion.div ref={scrollContainerRef} className="tw-w-full tw-overflow-auto tw-h-full">
            <Card className="tw-min-w-fit tw-shadow-xl !tw-bg-background-accent">
                <table className="tw-table-auto tw-bg-secondary/50 tw-w-full tw-min-w-max">
                    <thead>
                        <tr>
                            <th className="tw-p-3 tw-text-primary tw-bg-secondary tw-sticky tw-top-0 tw-left-0 tw-z-30">{t('period', 'Period')}</th>
                            {allDays.map(day => (
                                <th
                                    key={day}
                                    ref={day === today ? todayCellRef : undefined}
                                    className={`tw-text-primary tw-bg-secondary tw-sticky tw-top-0 ${day === today ? '!tw-bg-primary tw-text-secondary' : ''}`}
                                >
                                    {t(`daysAbbr.${day.toLowerCase()}`, t(`days.${day.toLowerCase()}`, day).slice(0, 3))}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {allPeriods.map(period => (
                            <tr key={period}>
                                <td className="tw-bg-secondary tw-font-semibold tw-text-primary tw-p-3 tw-text-center tw-sticky tw-left-0 tw-z-10">
                                    {period}
                                </td>
                                {allDays.map(day => {
                                    const details = timetable[period]?.[day];
                                    let formattedTime = "";
                                    if (details?.time) {
                                        const [start, end] = details.time.split(" - ");
                                        const format = (t: string) => t.slice(0, 5);
                                        formattedTime = `${format(start)} - ${format(end)}`;
                                    }
                                    return (
                                        <td
                                            key={day}
                                            className={`tw-p-2 tw-align-top ${day === today ? 'tw-bg-primary/50' : ''}`}
                                        >
                                            {details ? (
                                                <Card className="!tw-bg-secondary tw-text-primary tw-p-2 tw-rounded-xl tw-h-32 tw-w-40 tw-flex tw-flex-col tw-items-center tw-text-center tw-justify-center tw-gap-1 tw-text-sm tw-shadow">
                                                    <div className="tw-font-semibold tw-text-center">{details.subject}</div>
                                                    <div className="tw-text-xs">{formattedTime}</div>
                                                    <div className="tw-text-xs">{details.instructor}</div>
                                                    <div className="tw-text-xs">{details.room_number}</div>
                                                </Card>
                                            ) : (
                                                <div className="tw-text-gray-400 tw-h-28 tw-flex tw-items-center tw-justify-center">-</div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </motion.div>
    );
}

export default DetailedTimetable;
