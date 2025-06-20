import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { BonafideListResponse } from '@/types/bonafides';

interface FetchBonafideProps {
  student_id: string;
}

const fetchBonafides = async ({ student_id }: FetchBonafideProps): Promise<BonafideListResponse[]> => {
  const response = await axios.get('/api/method/unity_parent_app.api.bonafide.bonafide_list', {
    params: { student_id },
    withCredentials: true,
    headers: {
      Accept: 'application/json',
    },
  });

  return response.data.message;
};

export const useBonafideList = (student_id: string) => {
  return useQuery<BonafideListResponse[]>({
    queryKey: ['bonafide_certificate', 'list_bonafide', student_id],
    queryFn: () => fetchBonafides({ student_id }),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
