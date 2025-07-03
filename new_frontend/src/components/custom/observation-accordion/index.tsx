import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomAccordionProps {
    subject: string;
    observations: Observation[];
}

interface Observation {
    name: string;
    observation_type: string;
    observation_label: string;
    marks: number;
    total_marks: number;
    remarks?: string;
    Table?: { period_number: string; grade: string }[];
}

const ObservationAccordion = ({ subject, observations }: CustomAccordionProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const getScoreColor = (percentage: number) => {
        if (percentage >= 60) return "tw-text-green-700 tw-bg-green-100";
        if (percentage >= 40) return "tw-text-yellow-700 tw-bg-yellow-100";
        if (percentage >= 20) return "tw-text-red-600 tw-bg-red-100";
        return "tw-text-red-800 tw-bg-red-200";
    };

    const renderBody = (observation: Observation, index: number) => {
        const scorePercentage = (observation.marks / observation.total_marks) * 100;
        const scoreColor = getScoreColor(scorePercentage);

        return (
            <motion.div
                key={observation.name}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="tw-p-4 tw-rounded-lg tw-bg-gray-50 tw-border tw-border-gray-200 tw-shadow-sm tw-space-y-2"
            >
                <div className="tw-flex tw-items-center tw-justify-between">
                    <p className="tw-font-semibold tw-text-primary">{observation.observation_type}</p>
                    <p className="tw-font-semibold tw-text-primary tw-flex tw-items-center tw-gap-2">
                        Avg:
                        <span className={`tw-px-3 tw-py-1 tw-rounded-md tw-font-bold ${scoreColor}`}>
                            {observation.marks} / {observation.total_marks}
                        </span>
                    </p>
                </div>

                {observation.remarks && (
                    <p className="tw-text-sm tw-text-muted-foreground">{observation.remarks}</p>
                )}

                {observation.Table && observation.Table.length > 0 && (
                    <div className="tw-overflow-x-auto tw-mt-2">
                        <table className="tw-w-full tw-text-sm tw-bg-white tw-border tw-rounded-md">
                            <thead>
                                <tr className="tw-border-b">
                                    <th className="tw-text-left tw-px-4 tw-py-2">Period No.</th>
                                    {observation.Table.map((r, idx) => (
                                        <td key={idx} className="tw-text-center tw-px-4 tw-py-2">{r.period_number}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <th className="tw-text-left tw-px-4 tw-py-2">Grade</th>
                                    {observation.Table.map((r, idx) => (
                                        <td key={idx} className="tw-text-center tw-px-4 tw-py-2">{r.grade}</td>
                                    ))}
                                </tr>
                            </thead>
                        </table>
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <motion.div layout>
            <Accordion
                type="single"
                collapsible
                value={isOpen ? subject : ""}
                onValueChange={(val) => setIsOpen(val === subject)}
            >
                <AccordionItem
                    value={subject}
                    className="tw-border tw-border-gray-200 tw-rounded-xl tw-shadow-sm tw-mb-4"
                >
                    <AccordionTrigger
                        className="tw-px-4 tw-py-3 tw-bg-secondary tw-rounded-t-xl hover:tw-bg-gray-50 tw-transition tw-no-underline tw-decoration-none"
                        style={{ textDecoration: "none" }}
                    >
                        <div className="tw-flex tw-w-full tw-justify-between tw-items-center">
                            <span className="tw-font-bold tw-text-lg tw-text-primary">{subject}</span>
                            {!isOpen && (
                                <div className="tw-flex tw-gap-2">
                                    {observations.map((obs) => {
                                        const scorePercent =
                                            obs.total_marks > 0 ? (obs.marks / obs.total_marks) * 100 : 0;
                                        const scoreColor = getScoreColor(scorePercent);

                                        return (
                                            <span
                                                key={obs.name}
                                                className={`tw-w-10 tw-h-10 tw-rounded-full tw-p-0 tw-text-center tw-items-center tw-flex tw-justify-center tw-font-bold ${scoreColor}`}
                                            >
                                                {obs.observation_label}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="tw-p-4 tw-bg-gray-50 tw-rounded-b-xl">
                        <motion.div layout className="tw-space-y-4">
                            <AnimatePresence initial={false}>
                                {observations.map((obs, idx) => renderBody(obs, idx))}
                            </AnimatePresence>
                        </motion.div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </motion.div>
    );
};

export default ObservationAccordion;
