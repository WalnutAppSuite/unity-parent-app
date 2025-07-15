import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export interface SchoolLetterHead {
  data: {
    letter_head?: string;
    name?: string;
    [key: string]: unknown;
  };
}

const fetchSchoolLetterHead = async (school: string): Promise<SchoolLetterHead> => {
  const response = await axiosInstance.get(`/api/resource/School/${school}`, {
    params: { fields: '["letter_head"]' },
  });
  return response.data;
};

const useSchoolLetterHead = (school: string) => {
  return useQuery<SchoolLetterHead>({
    queryKey: ['school', 'letter_head', school],
    queryFn: () => fetchSchoolLetterHead(school),
    enabled: !!school,
    retry: 1,
  });
};

export default useSchoolLetterHead;
