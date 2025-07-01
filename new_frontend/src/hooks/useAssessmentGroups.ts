import { useMutation } from '@tanstack/react-query';

interface AssessmentGroupFilterParams {
  selected_year: string | null;
  class_name?: string | null;
}

export function useFetchAssessmentGroups(
  setAssessmentGroupOptions: (opts: { value: string; label: string }[]) => void,
  setErrorMessage: (msg: string) => void,
  setSelectedExam: (val: string) => void,
) {
  const assessmentGroupFilter = async (
    selected_year: string | null,
    class_name?: string | null,
  ) => {
    const resp = await fetch(
      `/api/resource/Assessment%20Group?filters=[["custom_academic_year","=","${selected_year}"],["custom_program","=","${class_name}"],["custom_show_in_app","=", "1"]]&fields=["assessment_group_name","name", "custom_program"]`,
    );
    if (!resp.ok) {
      throw new Error('No Result Found');
    }
    return resp.json();
  };

  return useMutation({
    mutationFn: ({ selected_year, class_name }: AssessmentGroupFilterParams) =>
      assessmentGroupFilter(selected_year, class_name),
    onSuccess: (data) => {
      if (data?.data?.length < 1) {
        setErrorMessage('Result Not Found');
        setSelectedExam('');
        setAssessmentGroupOptions([]);
      } else {
        // const groupNames = data?.data?.map?.((i: any) => i.name);
        const examOpts = data?.data?.map?.((i: any) => ({
          value: i.name,
          label: i.assessment_group_name,
        }));
        setAssessmentGroupOptions(examOpts);
      }
    },
    onError: (error) => {
      console.error('error', error);
    },
  });
}
