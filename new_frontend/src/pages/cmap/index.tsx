import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Weekly from "@/pages/weekly";
import Portion from "@/pages/portion";
import Daily from "@/pages/daily";
import { useAtom } from "jotai";
import { studentsAtom } from "@/store/studentAtoms";
import { useTranslation } from "react-i18next";

export default function AnimatedTabs() {

    const { t } = useTranslation('cmap')

    const tabs = [
        { id: "daily", label: t('dailyLable') },
        { id: "weekly", label: t('weeklyLable') },
        { id: "portion", label: t('portionLable') }
    ];
    const [selectedTab, setSelectedTab] = useState("daily");
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [indicatorStyle, setIndicatorStyle] = useState({
        left: 0,
        width: 0,
    });

    const [students] = useAtom(studentsAtom);

    useEffect(() => {
        const currentRef = tabRefs.current[selectedTab];
        if (currentRef) {
            setIndicatorStyle({
                left: currentRef.offsetLeft,
                width: currentRef.offsetWidth,
            });
        }
    }, [selectedTab]);

    const renderContent = () => {
        switch (selectedTab) {
            case "daily":
                return (
                    <Daily students={students} />
                );
            case "weekly":
                return (
                    <Weekly students={students} />
                );
            case "portion":
                return (
                    <Portion students={students} />
                );
            default:
                return null;
        }
    };


    return (
        <div className="tw-p-4">
            <div className="tw-flex tw-justify-center tw-mb-6">
                <div className="tw-relative tw-inline-flex tw-bg-secondary tw-rounded-full tw-p-1 tw-shadow-lg tw-border tw-border-gray-200">
                    <motion.div
                        className="tw-absolute tw-top-1 tw-bottom-1 tw-bg-primary tw-rounded-full tw-shadow-md"
                        layout
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            duration: 0.3
                        }}
                        style={{
                            left: `${indicatorStyle.left}px`,
                            width: `${indicatorStyle.width}px`,
                        }}
                    />

                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.id}
                            ref={(el) => (tabRefs.current[tab.id] = el)}
                            onClick={() => setSelectedTab(tab.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`tw-relative tw-z-10 tw-px-6 tw-py-2.5 tw-rounded-full tw-font-medium tw-text-sm tw-transition-colors tw-duration-200 ${selectedTab === tab.id
                                ? "tw-text-secondary"
                                : "tw-text-primary"
                                }`}
                        >
                            {tab.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Content Area with AnimatePresence */}
            <div className="xtw-overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="portion"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="tw-text-center"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}