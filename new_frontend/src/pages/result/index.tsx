import ProfileWrapper from "@/components/custom/ProfileWrapper";
import { Button } from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import { useAcademicYears } from "@/hooks/useAcademicYear";
import { useFetchAssessmentGroups } from "@/hooks/useExamMuate";
import { studentsAtom } from "@/store/studentAtoms";
import { useAtom } from "jotai";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const ResultChildComponent = ({ student }: { student: any }) => {
  const { t } = useTranslation("result");
  const { data: academicYears } = useAcademicYears(student.name);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [assessmentOptions, setAssessmentOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedExam, setSelectedExam] = useState("");

  const mutateAssessmentGroups = useFetchAssessmentGroups(
    (opts) => {
      setAssessmentOptions(opts); // opts is already: [{ value, label }]
      // setSelectedExam(opts.length > 0 ? opts[0].value : "");
    },
    (msg) => toast.error(msg),
    (format) => console.log(format),
    setSelectedExam,
    (opts) => console.log(opts)
  );


  const handleAcademicYearChange = (value: any) => {
    const selectedYearObj = academicYears?.find(
      (year) => year.academic_year === value
    );
    setSelectedAcademicYear(String(value));
    mutateAssessmentGroups.mutateAsync({
      selected_year: String(value),
      class_name: selectedYearObj?.program || student.program_name || null,
    });
  };

  console.log("Selected Academic Year:", selectedAcademicYear);
  return (
    <div className="tw-flex tw-flex-col tw-gap-3 tw-mt-5">
      <div className="tw-w-[250px] tw-mx-auto">
        <Dropdown
          options={academicYears?.map((year) => ({
            value: year.academic_year,
            label: year.academic_year,
            ...year
          })) || []}
          value={selectedAcademicYear}
          onChange={handleAcademicYearChange}
          placeholder={t("selectAcademicYear")}
        />
      </div>

      <div className="tw-w-[250px] tw-mx-auto">
        <Dropdown
          options={
            selectedAcademicYear && assessmentOptions.length > 0
              ? assessmentOptions
              : []
          }
          value={selectedExam}
          onChange={(value) => setSelectedExam(String(value))}
          placeholder={t("selectExam") || "Select Exam"}
          disabled={!selectedAcademicYear || assessmentOptions.length === 0}
        />
      </div>

      {selectedAcademicYear &&
        (!assessmentOptions || assessmentOptions.length === 0) && (
          <div className="tw-text-red-500 tw-font-semibold tw-text-sm">
            {t("noExamFound") || "No exam found"}
          </div>
        )}

      <Button className="tw-w-full tw-bg-white tw-text-black tw-font-semibold tw-rounded-xl tw-mt-2" style={{ color: "#1a1a1a" }}>
        {t("showResult")}
      </Button>
    </div>
  );
};

function ResultPage() {
  const [students] = useAtom(studentsAtom);

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <div className="tw-space-y-6 tw-max-w-md tw-mx-auto">
        {students.map((student) => {
          return (
            <div key={student.id} className="tw-border tw-p-4 tw-rounded-md">
              <ProfileWrapper
                name={student.name}
                classSection={student.classSection}
                student_name={student.student_name}
                image={student.image}
                reference_number={student.reference_number}
                first_name={student.first_name}
                custom_division={student.custom_division}
                last_name={student.last_name}
                program_name={student.program_name}
                isLoading={false}
                children={<ResultChildComponent student={student} />}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultPage;