import { CalendarDays, Clock3, ArrowRight, NotebookPen } from "lucide-react";
import { Card } from '@/components/ui/card';
import type { PTMLink } from "@/hooks/usePTMLinksQuery";
import { formatDate } from "@/utils/formatDate";
import { useAddPTMEntry } from '@/hooks/useAddPtmEntry';

function parseSlotToTimes(date: string, slot: string) {
    const [startStr, endStr] = slot.split(" - ");
    const startDateTime = new Date(`${date} ${startStr}`);
    const endDateTime = new Date(`${date} ${endStr}`);
    return { startDateTime, endDateTime };
}

function PTMCard({ data, student_id }: { data: PTMLink, student_id: string }) {
    const { date, day, slot, subject, gmeet_link, teacher } = data;
    const formattedDate = formatDate(date) || '';
    const { startDateTime, endDateTime } = parseSlotToTimes(date, slot);
    const now = new Date();

    const { mutate: addPTM, isPending } = useAddPTMEntry();

    let buttonText = "Join Meeting";
    let isDisabled = false;

    if (now < startDateTime) {
        buttonText = "Upcoming";
        isDisabled = true;
    } else if (now > endDateTime) {
        buttonText = "Ended";
        isDisabled = true;
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (isDisabled || isPending) return;

        addPTM(
            {
                student_id,
                gmeet_link,
                teacher,
            }
        );
    };

    return (
        <div className="tw-w-full">
            <Card className="tw-w-full tw-px-5 tw-py-4 !tw-rounded-3xl tw-text-primary tw-flex tw-flex-col tw-gap-4">
                <div className="tw-space-y-3">
                    <div className="tw-flex tw-items-center tw-gap-3 tw-font-semibold tw-text-primary">
                        <CalendarDays className="tw-w-5 tw-h-5 tw-text-[#544DDB]" />
                        <span>{day}, {formattedDate}</span>
                    </div>
                    <div className="tw-flex tw-items-center tw-gap-3 tw-font-semibold tw-text-primary">
                        <Clock3 className="tw-w-5 tw-h-5 tw-text-orange-500" />
                        <span>{slot}</span>
                    </div>
                    <div className="tw-flex tw-items-center tw-gap-3 tw-font-semibold tw-text-primary">
                        <NotebookPen className="tw-w-5 tw-h-5 tw-text-green-600" />
                        <span>{subject}</span>
                    </div>
                </div>
                <button
                    onClick={handleClick}
                    className={`tw-flex tw-justify-center tw-items-center tw-p-3 tw-bg-primary !tw-text-secondary tw-text-4 tw-font-semibold tw-rounded-xl ${isDisabled || isPending ? "tw-opacity-50 tw-pointer-events-none" : ""
                        }`}
                    tabIndex={isDisabled ? -1 : 0}
                    aria-disabled={isDisabled}
                >
                    {isPending ? "Loading..." : buttonText}
                    <ArrowRight className="tw-ml-2 tw-w-5 tw-h-5" />
                </button>
            </Card>
        </div>
    );
}

export default PTMCard;
