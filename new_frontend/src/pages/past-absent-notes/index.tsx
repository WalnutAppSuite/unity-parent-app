import ProfileWrapper from "@/components/custom/ProfileWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { useClassDetails } from "@/hooks/useClassDetails";
import usePastLeaveNotes from "@/hooks/usePastLeaveNotes";
import type { Student } from "@/types/students";
import { AnimatePresence, motion } from "framer-motion";
import { CircleChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PastNotes({ students }: { students: Student[] }) {
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
      children={< PastLeaveNotesChild studentId={student.name} />}
    />
  );
}

function PastLeaveNotesChild({ studentId }: { studentId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: pastLeaveDetails, isLoading, error } = usePastLeaveNotes(studentId);
  const toggleAccordion = () => setIsOpen((prev) => !prev);
  const { t } = useTranslation('past_leave_note')

  if (!pastLeaveDetails?.length) {
    return <p className="tw-text-sm tw-text-gray-500">No leave notes available.</p>;
  }

  if (isLoading) {
    return (
      <Skeleton className="tw-h-20" />
    );
  }

  if (error) {
    return (
      <div className="tw-rounded-lg tw-bg-secondary/15 tw-text-secondary tw-shadow-sm tw-p-4">
        <p className="tw-text-sm tw-text-red-500">{t("error") || "Error loading leave notes."}</p>
      </div>
    );
  }

  if (!pastLeaveDetails || !pastLeaveDetails.length) {
    return (
      <div className="tw-rounded-lg tw-bg-secondary/15 tw-text-secondary tw-shadow-sm tw-p-4">
        <p className="tw-text-sm tw-text-gray-500">{t("noData") || "No leave notes available."}</p>
      </div>
    );
  }

  const displayItems = isOpen ? pastLeaveDetails : [pastLeaveDetails[0]];

  return (
    <div className="tw-rounded-lg !tw-w-full tw-bg-secondary/15 tw-text-secondary tw-shadow-sm tw-p-4">
      <div
        className="tw-flex tw-justify-between tw-items-center tw-cursor-pointer"
        onClick={toggleAccordion}
      >
        <p className="tw-text-sm tw-font-medium">Past Leave Notes</p>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <CircleChevronDown size={20} />
        </motion.div>
      </div>

      <div className="tw-mt-3 tw-w-full tw-grid tw-grid-cols-2 tw-font-semibold tw-text-primary">
        <span>{t('date')}</span>
        <span>{t('reason')}</span>
      </div>

      <motion.div
        layout
        initial={false}
        transition={{
          layout: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
        }}
        className="tw-overflow-hidden"
      >
        <AnimatePresence mode="sync">
          {displayItems.map((item, idx) => {
            const formatted = (item.date);
            return (
              <motion.div
                key={`${formatted}-${item.reason}`}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  transition: {
                    opacity: { duration: 0.2, delay: idx * 0.05 },
                    height: { duration: 0.3, ease: "easeOut" },
                    layout: { duration: 0.3 }
                  }
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transition: {
                    opacity: { duration: 0.15 },
                    height: { duration: 0.2, ease: "easeIn" }
                  }
                }}
                className="tw-grid tw-grid-cols-2 tw-py-2 tw-text-sm tw-overflow-hidden tw-w-full"
              >
                <div>{formatted}</div>
                <div>{item.reason}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
