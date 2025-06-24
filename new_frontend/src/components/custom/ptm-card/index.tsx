import { CalendarDays, Clock3, ArrowRight, NotebookPen } from "lucide-react";
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PTMCardProps {
    date: string;
    time: string;
    day: string;
    subject: string;
    joinLink: string;
}

function PTMCard({ date, time, day, subject, joinLink }: PTMCardProps) {
    return (
        <div className="tw-w-full">
            <Card className="tw-w-full tw-px-5 tw-py-4 !tw-rounded-3xl tw-text-primary tw-flex tw-flex-col tw-gap-4">
                {/* Main meeting info - prominently displayed */}
                <div className="tw-space-y-3">
                    <div className="tw-flex tw-items-center tw-gap-3 tw-font-semibold tw-text-primary">
                        <CalendarDays className="tw-w-5 tw-h-5 tw-text-[#544DDB]" />
                        <span>{day}, {date}</span>
                    </div>

                    <div className="tw-flex tw-items-center tw-gap-3 tw-font-semibold tw-text-primary">
                        <Clock3 className="tw-w-5 tw-h-5 tw-text-orange-500" />
                        <span>{time}</span>
                    </div>

                    <div className="tw-flex tw-items-center tw-gap-3 tw-font-semibold tw-text-primary">
                        <NotebookPen className="tw-w-5 tw-h-5 tw-text-green-600" />
                        <span>{subject}</span>
                    </div>
                </div>

                {/* Prominent join button */}
                <a
                    href={joinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-flex tw-justify-center tw-items-center tw-p-3 tw-bg-primary !tw-text-secondary tw-text-4 tw-font-semibold tw-rounded-xl"
                >
                    Join Meeting Now
                    <ArrowRight className="tw-ml-2 tw-w-5 tw-h-5" />
                </a>
            </Card>
        </div>
    );
}

export default PTMCard;