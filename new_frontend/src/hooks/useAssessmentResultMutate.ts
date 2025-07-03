import { useMutation } from '@tanstack/react-query';

export const useAssessmentResultMutate = (
  selectedStudent: string,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: (data: any) => void;
    onError?: (error: unknown) => void;
  } = {},
) =>
  useMutation({
    mutationFn: async ({
      selected_year,
      selected_exam,
    }: {
      selected_year?: { academic_year: string; program: string } | null;
      selected_exam?: string;
    }) => {
      console.log('Selected Year', selected_year?.program);
      const resp = await fetch(
        `/api/resource/Assessment%20Result?filters=${encodeURIComponent(
          JSON.stringify([
            ['academic_year', '=', selected_year?.academic_year],
            ['assessment_group', '=', selected_exam],
            ['program', '=', selected_year?.program],
            ['student', '=', selectedStudent],
            ['docstatus', '=', '1'],
          ]),
        )}`,
      );
      if (!resp.ok) throw new Error('No Result Found');
      const data = await resp.json();
      return data.data;
    },
    onSuccess,
    onError,
  });
