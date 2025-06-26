import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import { CalendarDays, DollarSign, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

function FeeCard({ schedule, fee, index }: {
    schedule: any,
    fee?: any,
    index: number
}) {
    const { t } = useTranslation("fee_listing");
    const hasPaymentLink = !!fee?.payment_url;
    const status = fee?.status?.toLowerCase();

    const getStatusButton = () => {
        if (!hasPaymentLink) {
            return (
                <Badge variant="secondary" className="tw-bg-secondary/10 tw-text-secondary tw-text-xs">
                    {t('notDue')}
                </Badge>
            );
        }

        if (status === 'paid') {
            return (
                <a
                    href={fee.payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-inline-flex tw-items-center tw-justify-center tw-px-4 tw-py-2 tw-bg-primary tw-text-white tw-rounded-lg tw-text-sm tw-font-medium tw-transition-colors hover:tw-bg-primary/90"
                >
                    {t('download')}
                </a>
            );
        }

        if (status === 'partially paid') {
            return (
                <a
                    href={fee.payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-inline-flex tw-items-center tw-justify-center tw-px-4 tw-py-2 tw-bg-primary tw-text-white tw-rounded-lg tw-text-sm tw-font-medium tw-transition-colors hover:tw-bg-primary/90"
                >
                    {t('payRemaining')}
                </a>
            );
        }

        return (
            <a
                href={fee.payment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="tw-inline-flex tw-items-center tw-justify-center tw-px-4 tw-py-2 tw-bg-primary tw-text-white tw-rounded-lg tw-text-sm tw-font-medium tw-transition-colors hover:tw-bg-primary/90"
            >
                {t('payNow')}
            </a>
        );
    };

    const getStatusColor = () => {
        if (!hasPaymentLink) return "tw-bg-gray-100 tw-text-gray-600";
        if (status === 'paid') return "tw-bg-green-100 tw-text-green-700";
        if (status === 'partially paid') return "tw-bg-orange-100 tw-text-orange-700";
        return "tw-bg-red-100 tw-text-red-700";
    };

    const getStatusText = () => {
        if (!hasPaymentLink) return t('notDue');
        if (status === 'paid') return t('paid');
        if (status === 'partially paid') return t('partiallyPaid');
        return t('unpaid');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="tw-w-full"
        >
            <Card className="tw-w-full tw-px-5 tw-py-3 !tw-rounded-3xl tw-text-primary/70 tw-flex tw-flex-col tw-gap-2 tw-shadow-md" tabIndex={0} role="region">
                <div className="tw-flex tw-items-center tw-justify-between">
                    <div className="tw-flex tw-items-center tw-gap-2">
                        <Badge
                            className="tw-text-xs !tw-px-3 !tw-py-1 !tw-rounded-full !tw-bg-[#544DDB]/10 !tw-text-[#544DDB]"
                            variant="secondary"
                        >
                            {t('term')} {schedule.payment_term}
                        </Badge>
                    </div>
                    <span className="tw-flex tw-items-center tw-gap-2 tw-text-primary/70">
                        <CalendarDays /> {formatDate(schedule.due_date)}
                    </span>
                </div>

                <div className="tw-text-lg tw-mt-2 tw-flex tw-items-center tw-gap-3">
                    <span className="tw-font-bold tw-text-primary">
                        <span className="tw-mr-1">₹</span>
                        {schedule.payment_amount?.toLocaleString()}
                    </span>
                </div>

                {fee?.type && (
                    <div className="tw-flex tw-items-center tw-gap-2 tw-text-primary/70">
                        <Clock className="tw-w-4 tw-h-4" />
                        <span className="tw-text-sm tw-capitalize">
                            {fee.type}
                        </span>
                    </div>
                )}

                <div className="tw-flex tw-items-center tw-justify-between tw-mt-2">
                    <Badge className={`${getStatusColor()} tw-text-xs`}>
                        {getStatusText()}
                    </Badge>
                    {getStatusButton()}
                </div>
            </Card>
        </motion.div>
    );
}

export default FeeCard; 