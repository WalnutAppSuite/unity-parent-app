import { useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ProfileWrapper from '@/components/custom/ProfileWrapper';
import { Button } from '@/components/ui/button';
import { useFetchAcademicYears } from '@/hooks/useFetchAcademicYears';
import { useFetchAssessmentGroups } from '@/hooks/useAssessmentGroups';
import { useAssessmentResultMutate } from '@/hooks/useAssessmentResultMutate';
import { studentsAtom } from '@/store/studentAtoms';
import type { Student } from '@/types/students';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AssessmentOption {
  value: string;
  label: string;
}

interface AssessmentGroup {
  value: string;
  label: string;
}

interface AssessmentResult {
  name: string;
}

interface ResultFormData {
  selectedAcademicYear: string;
  selectedExam: string;
  assessmentOptions: AssessmentOption[];
  assessmentResults: string[];
  selectedExamGroup: AssessmentGroup | null;
}

// Constants
const INITIAL_FORM_DATA: ResultFormData = {
  selectedAcademicYear: '',
  selectedExam: '',
  assessmentOptions: [],
  assessmentResults: [],
  selectedExamGroup: null,
};

// Custom Hook for Result Form Logic
const useResultForm = (student: Student) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ResultFormData>(INITIAL_FORM_DATA);

  const { data: academicYears } = useFetchAcademicYears(student.name || '');
  const mutateAssessmentResult = useAssessmentResultMutate(student.name || '');

  const mutateAssessmentGroups = useFetchAssessmentGroups(
    (opts) => setFormData((prev) => ({ ...prev, assessmentOptions: opts })),
    (msg) => toast.error(msg),
    (value) => setFormData((prev) => ({ ...prev, selectedExam: String(value) })),
  );

  const handleAcademicYearChange = useCallback(
    async (value: string | number) => {
      const selectedYear = String(value);
      const selectedYearObj = academicYears?.find((year) => year.academic_year === selectedYear);

      setFormData((prev) => ({
        ...prev,
        selectedAcademicYear: selectedYear,
        selectedExam: '',
        assessmentOptions: [],
        assessmentResults: [],
        selectedExamGroup: null,
      }));

      try {
        await mutateAssessmentGroups.mutateAsync({
          selected_year: selectedYear,
          class_name: selectedYearObj?.program || student.program_name || null,
        });
      } catch {
        toast.error('Failed to fetch assessment groups');
      }
    },
    [academicYears, student.program_name, mutateAssessmentGroups],
  );

  const handleExamChange = useCallback(
    async (value: string | number) => {
      const selectedValue = String(value);
      const selectedGroup = formData.assessmentOptions.find((opt) => opt.value === selectedValue);

      setFormData((prev) => ({
        ...prev,
        selectedExam: selectedValue,
        selectedExamGroup: selectedGroup || null,
      }));

      if (selectedValue) {
        try {
          const selectedYearObj = academicYears?.find(
            (year) => year.academic_year === formData.selectedAcademicYear,
          );

          const result = await mutateAssessmentResult.mutateAsync({
            selected_year: selectedYearObj
              ? {
                academic_year: selectedYearObj.academic_year,
                program: selectedYearObj.program,
              }
              : null,
            selected_exam: selectedValue,
          });

          const names = result?.map((res: AssessmentResult) => res.name) || [];

          setFormData((prev) => ({
            ...prev,
            assessmentResults: names,
          }));
        } catch {
          toast.error('Failed to fetch assessment results');
        }
      }
    },
    [
      formData.selectedAcademicYear,
      formData.assessmentOptions,
      academicYears,
      mutateAssessmentResult,
    ],
  );
  const handleShowResult = useCallback(() => {
    const { selectedAcademicYear, selectedExam, assessmentResults, selectedExamGroup } = formData;

    // Validation
    if (!selectedAcademicYear) {
      toast.error('Please select an academic year');
      return;
    }

    if (!selectedExam) {
      toast.error('Please select an exam');
      return;
    }

    // Prepare navigation data
    const examName = selectedExamGroup?.label || selectedExam;
    const { first_name, school } = student;
    const params = new URLSearchParams({
      student: encodeURIComponent(JSON.stringify({ first_name, school })),
      academicYear: selectedAcademicYear,
      examName: examName,
      examValue: selectedExam,
      programName:
        academicYears?.find((year) => year.academic_year === selectedAcademicYear)?.program || '',
      resultNames: encodeURIComponent(JSON.stringify(assessmentResults)),
      assessmentGroupName: selectedExamGroup?.label || '',
      schoolName: student.school || '',
    });
    const studentNameParam = encodeURIComponent(student.name || student.student_name || '');
    const url = `/result-details/${studentNameParam}?${params.toString()}`;
    navigate(url);
  }, [formData, student, navigate]);

  const isFormValid = formData.selectedAcademicYear && formData.selectedExam;
  const hasNoExams = formData.selectedAcademicYear && formData.assessmentOptions.length === 0;

  return {
    formData,
    academicYears,
    handleAcademicYearChange,
    handleExamChange,
    handleShowResult,
    isFormValid,
    hasNoExams,
    isLoading: mutateAssessmentGroups.isPending || mutateAssessmentResult.isPending,
  };
};

// Result Form Component
const ResultForm = ({ student }: { student: Student }) => {
  const { t } = useTranslation('result');
  const {
    formData,
    academicYears,
    handleAcademicYearChange,
    handleExamChange,
    handleShowResult,
    isFormValid,
    hasNoExams,
    isLoading,
  } = useResultForm(student);

  const academicYearOptions =
    academicYears?.map((year) => ({
      value: year.academic_year,
      label: year.academic_year,
      ...year,
    })) || [];

  return (
    <div className="tw-flex tw-flex-col tw-gap-3 tw-mt-5">
      {/* Academic Year Dropdown */}
      <Select
        value={formData.selectedAcademicYear}
        onValueChange={handleAcademicYearChange}
        disabled={isLoading}
      >
        <SelectTrigger className="tw-border tw-rounded-md tw-h-10">
          <SelectValue placeholder={t('selectAcademicYear')} />
        </SelectTrigger>
        <SelectContent>
          {academicYearOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>


      <Select
        value={formData.selectedExam}
        onValueChange={handleExamChange}
        disabled={
          !formData.selectedAcademicYear || formData.assessmentOptions.length === 0 || isLoading
        }
      >
        <SelectTrigger className="tw-border tw-rounded-md tw-h-10">
          <SelectValue placeholder={t('selectExam')} />
        </SelectTrigger>
        <SelectContent>
          {formData.assessmentOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Error Message */}
      {hasNoExams && (
        <div className="tw-text-red-500 tw-font-semibold tw-text-sm tw-text-center">
          {t('noExamFound') || 'No exam found'}
        </div>
      )}

      {/* Show Result Button */}
      <Button
        className="tw-bg-secondary !tw-text-primary hover:!tw-bg-secondary/80 tw-text-4 tw-font-semibold tw-rounded-xl"
        onClick={handleShowResult}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? 'Loading...' : t('showResult')}
      </Button>
    </div>
  );
};

// Student Card Component
const StudentCard = ({ student }: { student: Student }) => (
  <div className="tw-border tw-p-4 tw-rounded-md">
    <ProfileWrapper
      name={student.name || ''}
      classSection={student.classSection}
      student_name={student.student_name}
      image={student.image}
      reference_number={student.reference_number}
      first_name={student.first_name}
      custom_division={student.custom_division}
      last_name={student.last_name}
      program_name={student.program_name}
      isLoading={false}
    >
      <ResultForm student={student} />
    </ProfileWrapper>
  </div>
);

// Main Result Page Component
const ResultPage = () => {
  const [students] = useAtom(studentsAtom);
  const { t } = useTranslation('result');

  if (!students.length) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-min-h-screen">
        <div className="tw-text-center">
          <h2 className="tw-text-xl tw-font-semibold tw-mb-2">{t('noStudentsFound')}</h2>
          <p className="tw-text-gray-600">{t('pleaseAddStudents')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      {students.map((student) => (
        <StudentCard key={student.name || ''} student={student} />
      ))}
    </div>
  );
};

export default ResultPage;
