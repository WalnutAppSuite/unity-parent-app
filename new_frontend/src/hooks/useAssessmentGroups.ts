import { useMutation } from '@tanstack/react-query';

interface AssessmentGroupFilterParams {
  selected_year: string | null;
  class_name?: string | null;
}
interface AssessmentGroupItem {
  name: string;
  assessment_group_name: string;
  custom_program: string;
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
    const url = new URL('/api/resource/Assessment%20Group', window.location.origin);
    const filters = [
      ['custom_academic_year', '=', selected_year],
      ['custom_program', '=', class_name],
      ['custom_show_in_app', '=', '1'],
    ];
    const fields = ['assessment_group_name', 'name', 'custom_program'];

    url.searchParams.set('filters', JSON.stringify(filters));
    url.searchParams.set('fields', JSON.stringify(fields));

    const resp = await fetch(url.toString());
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
        const examOpts = data?.data?.map?.((i: AssessmentGroupItem) => ({
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
