import { Calendar, Clock, MessageCircle } from 'lucide-react'
import { formatDate, formatTime } from '@/utils/formatDate';

export default function OfflinePTMCard({ data }: { data: any }) {
    return (
        <div className="tw-bg-secondary tw-text-primary tw-rounded-xl tw-p-4 tw-w-full tw-shadow-sm tw-font-sans tw-flex tw-flex-col tw-gap-2">
            <div className="tw-flex tw-items-center">
                <span className="tw-text-blue-700 tw-mr-2"><Calendar /></span>
                <span className="tw-font-semibold">
                    {formatDate(data.start)}
                </span>
            </div>
            <div className="tw-flex tw-items-center">
                <span className="tw-text-orange-500 tw-mr-2"><Clock /></span>
                <span className="tw-font-semibold">
                    {formatTime(data.start)} - {formatTime(data.end)}
                </span>
            </div>
            <div className="tw-flex tw-items-start">
                <span className="tw-text-green-500 tw-mr-2"><MessageCircle /></span>
                <span className="tw-font-semibold">{data.event}</span>
            </div>
        </div>
    );
}