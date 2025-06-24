import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { studentsAtom } from "@/store/studentAtoms";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import CreateNote from '@/pages/create-absent-notes/index'
import PastNotes from '@/pages/past-absent-notes/index'

export default function AnimatedTabs() {
  const { t } = useTranslation('absent')

  const [students] = useAtom(studentsAtom);

  const tabs = [
    { id: "create", label: t('createLable') },
    { id: "past-notes", label: t('pastNotes') },
  ];

  const [selectedTab, setSelectedTab] = useState("create");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

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
      case "create":
        return (
          <CreateNote students={students} />
        );
      case "past-notes":
        return (
          <PastNotes students={students} />
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