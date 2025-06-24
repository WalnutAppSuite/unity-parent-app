import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import type { Student } from '@/types/students';

const fetchStudents = async (): Promise<Student[]> => {
  const response = await axiosInstance.get("/api/method/unity_parent_app.api.cmap.get_students", {
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
    }
  });

  return response.data.message;
};

export const useStudents = () => {
  return useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: fetchStudents,
    staleTime: 5 * 60 * 1000,
  });
};
