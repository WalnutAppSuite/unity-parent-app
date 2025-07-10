import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useSchoolLetterHead from "@/hooks/useSchoolLetterHead";
import usePrintFormat from "@/hooks/usePrintFormat";
import { usePrintFormatMutate } from "@/hooks/usePrintViewMutate";
import { useTranslation } from "react-i18next";

interface Student {
  name?: string;
  student_name?: string;
  first_name?: string;
  program_name?: string;
  school?: string;
}

interface PrintFormat {
  html: string;
  style: string;
}

const ResultTab = ({ printFormat, loading, error }: { printFormat: PrintFormat | null; loading: boolean; error: string }) => {
  const { t } = useTranslation("result");
  if (loading) return <div className="tw-text-center tw-p-8">{t("loadingResult")}</div>;
  if (error) return <div className="tw-text-red-500 tw-text-center tw-p-4">{error}</div>;
  return (
    <div className="tw-p-4">
      {printFormat ? (
        <div dangerouslySetInnerHTML={{ __html: printFormat.html }} />
      ) : (
        <div className="tw-text-center tw-text-gray-500 tw-p-4">{t("noResultData")}</div>
      )}
    </div>
  );
};

const MarksTab = ({ printFormat, loading, error }: { printFormat: PrintFormat | null; loading: boolean; error: string }) => {
  const { t } = useTranslation("result");
  if (loading) return <div className="tw-text-center tw-p-8">{t("loadingMarks")}</div>;
  if (error) return <div className="tw-text-red-500 tw-text-center tw-p-4">{error}</div>;
  return (
    <div className="tw-p-4">
      {printFormat ? (
        <div dangerouslySetInnerHTML={{ __html: printFormat.html }} />
      ) : (
        <div className="tw-text-center tw-text-gray-500 tw-p-4">{t("noMarksData")}</div>
      )}
    </div>
  );
};

const ResultDetailsPage = () => {
  const { t } = useTranslation("result");
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("result");
  const [student, setStudent] = useState<Student | null>(null);

  // Separate state for each tab
  const [resultState, setResultState] = useState({ loading: false, error: "", data: null as PrintFormat | null, loaded: false });
  const [marksState, setMarksState] = useState({ loading: false, error: "", data: null as PrintFormat | null, loaded: false });

  const examValue = searchParams.get("examValue");
  const academicYear = searchParams.get("academicYear");
  const assessmentGroupName = searchParams.get("assessmentGroupName");
  const resultNames = searchParams.get("resultNames");
  const schoolName = searchParams.get("schoolName");
  const programName = searchParams.get("programName");
  const studentData = searchParams.get("student");

  const parsedResultNames = resultNames ? JSON.parse(decodeURIComponent(resultNames)) : [];
  const firstResultName = parsedResultNames[0];

  useEffect(() => {
    if (studentData && !student) {
      try {
        setStudent(JSON.parse(decodeURIComponent(studentData)));
      } catch {
        setResultState((s) => ({ ...s, error: t("invalidStudentData") }));
      }
    }
    // eslint-disable-next-line
  }, [studentData]);

  // Only call hooks when we have valid parameters
  const schoolNameForHook = schoolName || student?.school || "Default School";
  const { data: schoolLetterHeadData, isLoading: schoolLetterHeadLoading, error: schoolLetterHeadError } = useSchoolLetterHead(schoolNameForHook);
  const { data: assessmentGroupData, isLoading: assessmentGroupLoading, error: assessmentGroupError } = usePrintFormat(examValue || "");
  const printFormatMutation = usePrintFormatMutate();

  // Fetch data for the active tab when dependencies are ready
  useEffect(() => {
    if (!assessmentGroupData || !schoolLetterHeadData || !programName || !firstResultName) return;

    if (activeTab === "result" && !resultState.loaded) {
      setResultState((s) => ({ ...s, loading: true, error: "" }));
      printFormatMutation.mutateAsync({
        exam_name: firstResultName,
        selectedYear: { program: programName },
        printFormatMode: "result",
        assessmentGroupData,
        letterHeadData: schoolLetterHeadData,
      })
        .then((result) => setResultState({ loading: false, error: "", data: result, loaded: true }))
        .catch((err) =>
          setResultState({
            loading: false,
            error: err instanceof Error ? err.message : t("failedToFetchPrintFormat"),
            data: null,
            loaded: false,
          })
        );
    } else if (activeTab === "marks" && !marksState.loaded) {
      setMarksState((s) => ({ ...s, loading: true, error: "" }));
      printFormatMutation.mutateAsync({
        exam_name: firstResultName,
        selectedYear: { program: programName },
        printFormatMode: "marks",
        assessmentGroupData,
        letterHeadData: schoolLetterHeadData,
      })
        .then((result) => setMarksState({ loading: false, error: "", data: result, loaded: true }))
        .catch((err) =>
          setMarksState({
            loading: false,
            error: err instanceof Error ? err.message : t("failedToFetchPrintFormat"),
            data: null,
            loaded: false,
          })
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Show loading while dependencies are loading
  if (!student) {
    return <div className="tw-text-center tw-p-8">{t("loadingStudentData")}</div>;
  }
  
  // Check if required parameters are available
  if (!examValue) {
    return <div className="tw-text-center tw-p-8 tw-text-red-500">{t("missingExamValue")}</div>;
  }
  
  // Show loading states
  if (schoolLetterHeadLoading || assessmentGroupLoading) {
    return <div className="tw-text-center tw-p-8">{t("loadingDependencies")}</div>;
  }
  
  // Show error states
  if (schoolLetterHeadError) {
    return <div className="tw-text-center tw-p-8 tw-text-red-500">{t("failedToFetchPrintFormat")}</div>;
  }
  
  if (assessmentGroupError) {
    return <div className="tw-text-center tw-p-8 tw-text-red-500">{t("failedToFetchPrintFormat")}</div>;
  }
  
  if (!assessmentGroupData || !schoolLetterHeadData) {
    return <div className="tw-text-center tw-p-8">{t("loadingDependencies")}</div>;
  }

  const tabs = [
    { id: "result", label: t("resultTab") },
    { id: "marks", label: t("marksTab") },
  ];

  const isResultDisabled = !assessmentGroupData?.custom_print_configuration;
  const isMarksDisabled = !assessmentGroupData?.result_print_format;

  const handleDownloadPdf = async () => {
     const { i18n } = useTranslation();

    if (!firstResultName || !assessmentGroupData || !schoolLetterHeadData) {
      toast.error(t("noDataForDownload"));
      return;
    }
    try {
      const format =
        activeTab === "result"
          ? assessmentGroupData.custom_print_configuration || ""
          : assessmentGroupData.result_print_format || "";
      const params = new URLSearchParams({
        doctype: "Assessment Result",
        name: firstResultName,
        program: programName || "",
        format,
        no_letterhead: "0",
        letterhead: schoolLetterHeadData?.data?.letter_head || "Default letter head",
        _lang: i18n.language,
      });
      const downloadUrl = `/api/method/frappe.utils.print_format.download_pdf?${params.toString()}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${student?.first_name || "student"}_${activeTab}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(t("pdfDownloadStarted"));
    } catch(error) {
      console.error("Download failed:", error);
      toast.error(t("downloadFailed"));
    }
  };

  return (
    <div className="tw-min-h-screen tw-bg-gray-50 tw-p-4">
      <div className="tw-max-w-4xl tw-mx-auto">
        <div className="tw-text-center tw-mb-4">
          <h2 className="tw-text-xl tw-font-semibold">{student.first_name}</h2>
          <p className="tw-text-gray-600">{academicYear}</p>
          <p className="tw-text-gray-600">{assessmentGroupName}</p>
        </div>
        <div className="tw-flex tw-justify-center tw-mb-6">
          <div className="tw-relative tw-inline-flex tw-bg-gray-200 tw-rounded-full tw-p-1 tw-shadow-lg tw-border tw-border-gray-200">
            {tabs.map((tab) => {
              const isDisabled = tab.id === "result" ? isResultDisabled : isMarksDisabled;
              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && setActiveTab(tab.id)}
                  disabled={isDisabled}
                  className={`tw-relative tw-z-10 tw-px-6 tw-py-2.5 tw-rounded-full tw-font-medium tw-text-sm tw-transition-colors tw-duration-200 ${activeTab === tab.id
                    ? "tw-text-white tw-bg-blue-600"
                    : isDisabled
                      ? "tw-text-gray-400 tw-cursor-not-allowed"
                      : "tw-text-gray-700 hover:tw-text-gray-900"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {activeTab === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResultTab
                printFormat={resultState.data}
                loading={resultState.loading}
                error={resultState.error}
              />
            </motion.div>
          )}
          {activeTab === "marks" && (
            <motion.div
              key="marks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MarksTab
                printFormat={marksState.data}
                loading={marksState.loading}
                error={marksState.error}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="tw-mt-6 tw-text-center tw-space-x-4">
          <Button
            onClick={handleDownloadPdf}
            className="tw-bg-blue-600 tw-text-white tw-px-6 tw-py-2 tw-rounded-lg hover:tw-bg-blue-700"
            disabled={!firstResultName || !assessmentGroupData || resultState.loading || marksState.loading}
          >
            {(resultState.loading || marksState.loading) ? t("loading") : t("downloadPdf")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultDetailsPage;
