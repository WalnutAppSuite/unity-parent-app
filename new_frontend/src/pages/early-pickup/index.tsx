import { useAtom } from "jotai";
import { studentsAtom } from "@/store/studentAtoms";
import { useClassDetails } from '@/hooks/useClassDetails';
import type { Student } from "@/types/students";
import ProfileWrapper from "@/components/custom/ProfileWrapper";
import { SingleDatePicker } from "@/components/custom/date-picker-single";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import useEarlyPickUpMutation from '@/hooks/useEarlyPickup';
import { toast } from "sonner";
import EarlyPickupInstruction from "@/components/custom/instruction/earlyPickup"
import LoadingSpinner from "@/components/LoadingSpinner";

function EarlyPickup() {

  const [students] = useAtom(studentsAtom);

  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-full tw-bg-transparent tw-backdrop-blur-sm tw-w-full tw-inset-0 tw-absolute tw-left-0 tw-top-0 tw-z-999">
        <div className="tw-flex tw-w-1/2">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="tw-p-4">
      <EarlyPickupInstruction />
      {students.map((student) => (
        <StudentProfileWithFilters key={student.name} student={student} setLoading={setLoading} />
      ))}
    </div>
  )
}

function StudentProfileWithFilters({ student, setLoading }: { student: Student, setLoading: (loading: boolean) => void }) {

  const { data: classDetails, isLoading: classLoading } = useClassDetails(student.name);

  if (!classDetails || (Array.isArray(classDetails) && classDetails.length === 0) || (typeof classDetails === "object" && Object.keys(classDetails).length === 0)) {
    return null;
  }

  return (
    <ProfileWrapper
      image={student.image}
      student_name={student.student_name}
      reference_number={student.reference_number}
      custom_division={student.custom_division}
      first_name={student.first_name}
      last_name={student.last_name}
      program_name={student.program_name}
      isLoading={classLoading}
      children={<EarlyPickupChild studentId={student.name} program={student.program} setLoading={setLoading} />}
    />
  );
}

export default EarlyPickup;

function EarlyPickupChild({ studentId, program, setLoading }: { studentId: string; program: string, setLoading: (loading: boolean) => void }) {
  const { t } = useTranslation("early_pickup");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [reason, setReason] = useState("");

  const { mutateAsync } = useEarlyPickUpMutation();

  const handleEarlyPickup = async () => {
    if (!date) return;
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().split("T")[0];

    setLoading(true);
    try {
      await mutateAsync({
        student: studentId,
        dates: [formattedDate],
        date: formattedDate,
        time: time,
        status: "early_pickup",
        program: program,
        note: reason,
      });
      toast.success("Early pickup request submitted successfully!");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong while submitting the application , please try again later";
      toast.error(`Submission failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      {/* Date */}
      <div className="tw-flex tw-items-start tw-flex-col tw-gap-2">
        <label htmlFor="date-picker" className="tw-text-secondary tw-text-sm tw-font-medium">
          {t("pickupDateLable")} *
        </label>
        <div className="tw-w-full">
          <SingleDatePicker
            placeHolder={t("pickDatePlaceholder")}
            value={date}
            minDate={yesterday}
            onChange={(d) => {
              if (d instanceof Date || d === undefined) {
                setDate(d);
              }
            }}
            className="tw-flex-1"
          />
        </div>
      </div>

      {/* Time */}
      <div className="tw-flex tw-items-start tw-gap-2 tw-flex-col">
        <label htmlFor="time-input" className="tw-text-secondary tw-text-sm tw-font-medium">
          {t("pickTimeLable")} *
        </label>
        <Input
          id="time-input"
          required
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          className="tw-flex-1 !tw-bg-black/10 !placeholder:tw-text-secondary !tw-text-secondary"
        />
      </div>

      {/* Reason */}
      <div className="tw-flex tw-items-start tw-gap-2 tw-flex-col">
        <label htmlFor="text-area" className="tw-text-secondary tw-text-sm tw-font-medium">
          {t("textAreaLable")}
        </label>
        <Textarea
          id="text-area"
          placeholder={t('textAreaPlaceholder')}
          value={reason}
          onChange={e => setReason(e.target.value)}
          className="tw-flex-1 !tw-bg-black/10 placeholder:tw-text-secondary tw-text-secondary !tw-h-32 tw-resize-none !tw-text-[14px]"
        />
      </div>

      <Button
        className="tw-bg-secondary !tw-text-primary hover:!tw-bg-secondary/80 tw-text-4 tw-font-semibold tw-rounded-xl"
        disabled={!date || !time}
        onClick={handleEarlyPickup}
      >
        {t('button')}
      </Button>
    </div>
  );
}