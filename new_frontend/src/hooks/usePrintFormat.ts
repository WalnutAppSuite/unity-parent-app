import { useQuery } from '@tanstack/react-query';

export interface AssessmentGroupData {
  result_print_format: string | null;
  custom_print_configuration: string | null;
  custom_school?: string;
}

const usePrintFormat = (assessment_group: string) => {
  return useQuery({
    queryKey: ['assessment_group', 'data', assessment_group],
    queryFn: async (): Promise<AssessmentGroupData> => {
      if (!assessment_group) {
        throw new Error('Assessment group is required');
      }

      const response = await fetch(`/api/resource/Assessment Group/${assessment_group}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assessment group data');
      }

      const data = await response.json();
      return data.data;
    },
    enabled: !!assessment_group,
  });
};

export default usePrintFormat;
