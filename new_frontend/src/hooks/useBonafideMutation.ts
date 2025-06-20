// hooks/useBonafideMutation.ts
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useBonafideMutation = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: async (studentId: string) => {
      const response = await axios.post('/api/method/edu_quality.public.py.walsh.bonafide.send_bonafide', {
        student_id: studentId,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = response.data;
      if (!data?.message) {
        throw new Error('Unexpected response format');
      }
      return data.message;
    },
    onSuccess,
    onError: (error) => {
      console.error('Error:', error);
    },
  });
};
