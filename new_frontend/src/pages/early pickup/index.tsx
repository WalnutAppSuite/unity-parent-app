import { useAtom } from "jotai";
import { studentsAtom } from "@/store/studentAtoms";
import { useClassDetails } from '@/hooks/useClassDetails';
import type { Student } from "@/types/students";
import ProfileWrapper from "@/components/custom/ProfileWrapper";
import { SingleDatePicker } from "@/components/custom/date picker single";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import useEarlyPickUpMutation from '@/hooks/useEarlyPickup';
import { toast } from "sonner";

function EarlyPickup() {

  const [students] = useAtom(studentsAtom);

  return (
    <div className="tw-p-4">
      {students.map((student) => (
        <StudentProfileWithFilters key={student.name} student={student} />
      ))}
    </div>
  )
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
      children={<EarlyPickupChild studentId={student.name} program={student.program} />}
    />
  );
}

export default EarlyPickup;

function EarlyPickupChild({ studentId, program }: { studentId: string; program: string }) {
  const { t } = useTranslation("early_pickup");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [reason, setReason] = useState("");

  const { mutate } = useEarlyPickUpMutation();

  const handleEarlySubmit = () => {
    if (!date) return;
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().split("T")[0];

    mutate({
      student: studentId,
      dates: [formattedDate],
      date: formattedDate,
      time: time,
      status: "early_pickup",
      program: program,
      note: reason,
    }, {
      onSuccess: () => {
        toast.success("Early pickup request submitted successfully!");
      },
      onError: (err: any) => {
        const message = err?.response?.data?.message || "Something went wrong while submitting the application , please try again later";
        toast.error(`Submission failed: ${message}`);
      }
    });
  }

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      {/* Date */}
      <div className="tw-flex tw-items-start tw-flex-col tw-gap-2">
        <label htmlFor="date-picker" className="tw-text-secondary tw-text-sm tw-font-medium">
          {t("pickupDateLable")}
          <span className="tw-text-red-500"> *</span>
        </label>
        <div className="tw-w-full">
          <SingleDatePicker
            placeHolder={t("pickDatePlaceholder")}
            value={date}
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
          {t("pickTimeLable")}
          <span className="tw-text-red-500"> *</span>
        </label>
        <Input
          id="time-input"
          required
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          className="tw-flex-1 !tw-bg-black/10 !placeholder:tw-text-secondary tw-text-secondary"
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
        className="tw-bg-secondary !tw-text-primary tw-text-4 tw-font-semibold tw-rounded-xl"
        disabled={!date || !time}
        onClick={handleEarlySubmit}
      >
        {t('button')}
      </Button>
    </div>
  );
}