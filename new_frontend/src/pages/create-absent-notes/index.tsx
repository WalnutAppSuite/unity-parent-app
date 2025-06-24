
import ProfileWrapper from '@/components/custom/ProfileWrapper';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { Student } from '@/types/students';
import { SingleDatePicker } from '@/components/custom/date-picker-single';
import { useState } from 'react';
import { useClassDetails } from '@/hooks/useClassDetails';
import { Textarea } from '@/components/ui/textarea';
import { formatDateFromISO, getDatesBetween } from '@/utils/formatDate'
import useLeaveNote from '@/hooks/useLeaveNote';
import { toast } from 'sonner';

export default function CreateNote({ students }: { students: Student[] }) {
    return (
        <div className="tw-flex tw-flex-col tw-gap-4">
            {students.map((student) => (
                <StudentProfileWithFilters key={student.name} student={student} />
            ))}
        </div>
    );
}

function StudentProfileWithFilters({ student }: { student: Student }) {

    const { data: classDetails, isLoading: classLoading } = useClassDetails(student.name);

    if (!classDetails || (Array.isArray(classDetails) && classDetails.length === 0) || (typeof classDetails === "object" && Object.keys(classDetails).length === 0)) {
        return null;
    }

    return (
        <ProfileWrapper
            image={student.image}
            name={student.name}
            student_name={student.student_name}
            classSection={student.classSection}
            reference_number={student.reference_number}
            custom_division={student.custom_division}
            first_name={student.first_name}
            last_name={student.last_name}
            program_name={student.program_name}
            isLoading={classLoading}
            children={<WeeklyChildren name={student.first_name} division={classDetails.division.name} />}
        />
    );
}


function WeeklyChildren({ name, division }: { name: string, division: string }) {
    const { t } = useTranslation('create_absent');
    const [fromDate, setFromDate] = useState<Date | undefined>();
    const [toDate, setToDate] = useState<Date | undefined>();
    const [reason, setReason] = useState("");

    const { mutate } = useLeaveNote();

    const handleCreateButtonClick = () => {

        if (!fromDate || !toDate || !reason || !name || !division) {
            return null
        }

        const formattedFrom = formatDateFromISO(fromDate);
        const formattedTo = formatDateFromISO(toDate);
        const allDates = getDatesBetween(fromDate, toDate);

        mutate(
            {
                student: name,
                program: division,
                end_date: formattedTo,
                start_date: formattedFrom,
                dates: allDates,
                note: reason,
                status: "sick"
            },
            {
                onSuccess: () => {
                    toast.success(t("Leave note created successfully!"));
                    setFromDate(undefined);
                    setToDate(undefined);
                    setReason("");
                },
                onError: (err: any) => {
                    toast.error(t("Failed to create leave note.") + (err?.message ? `: ${err.message}` : ""));
                },
            }
        );
    };

    return (
        <div className="tw-flex tw-flex-col tw-gap-4">
            {/* Date */}
            <div className="tw-flex tw-items-start tw-flex-col tw-gap-2">
                <label htmlFor="date-picker" className="tw-text-secondary tw-text-sm tw-font-medium">
                    {t("fromLable")}
                    <span className="tw-text-red-500"> *</span>
                </label>
                <div className="tw-w-full">
                    <SingleDatePicker
                        placeHolder={t("fromPlaceholder")}
                        value={fromDate}
                        onChange={(d) => {
                            if (d instanceof Date || d === undefined) {
                                setFromDate(d);
                                if (toDate && d && toDate < d) setToDate(undefined);
                            }
                        }}
                        className="tw-flex-1"
                    />
                </div>
            </div>


            {/* Time */}
            <div className="tw-flex tw-items-start tw-flex-col tw-gap-2">
                <label htmlFor="date-picker" className="tw-text-secondary tw-text-sm tw-font-medium">
                    {t("toLable")}
                    <span className="tw-text-red-500"> *</span>
                </label>
                <div className="tw-w-full">
                    <SingleDatePicker
                        placeHolder={t("toPlaceholder")}
                        value={toDate}
                        onChange={(d) => {
                            if (d instanceof Date || d === undefined) {
                                setToDate(d);
                            }
                        }}
                        className="tw-flex-1"
                        minDate={fromDate}
                    />
                </div>
            </div>

            {/* Reason */}
            <div className="tw-flex tw-items-start tw-gap-2 tw-flex-col">
                <label htmlFor="text-area" className="tw-text-secondary tw-text-sm tw-font-medium">
                    {t("notesLable")}
                    <span className="tw-text-red-500"> *</span>
                </label>
                <Textarea
                    id="text-area"
                    placeholder={t('notesPlaceholder')}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="tw-flex-1 !tw-bg-black/10 placeholder:tw-text-secondary tw-text-secondary !tw-h-32 tw-resize-none !tw-text-[14px]"
                />
            </div>

            <Button
                className="tw-bg-secondary !tw-text-primary tw-text-4 tw-font-semibold tw-rounded-xl"
                disabled={!fromDate || !toDate || !reason}
                onClick={handleCreateButtonClick}
            >
                {t('button')}
            </Button>
        </div>
    );
}
