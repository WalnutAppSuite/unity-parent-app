import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { BonafideCertificate } from '@/types/bonafides';

interface FetchBonafideProps {
  student_id: string;
}

const fetchBonafides = async ({ student_id }: FetchBonafideProps): Promise<BonafideCertificate[]> => {
  try {
    const response = await axios.get('/api/method/unity_parent_app.api.bonafide.bonafide_list', {
      params: { student_id },
      withCredentials: true,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.data || !Array.isArray(response.data.message)) {
      throw new Error('Invalid API response structure');
    }

    return response.data.message;
  } catch (error) {
    console.error('Failed to fetch bonafide certificates:', error);
    throw error;
  }
};

export const useBonafideList = (student_id: string) => {
  return useQuery<BonafideCertificate[]>({
    queryKey: ['bonafide_certificate', 'list_bonafide', student_id],
    queryFn: () => fetchBonafides({ student_id }),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
