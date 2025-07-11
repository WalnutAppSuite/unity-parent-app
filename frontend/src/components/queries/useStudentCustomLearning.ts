import { useCustom } from "@refinedev/core";

interface StudentCustomLearningResponse {
  success: boolean;
  custom_learning?: Array<{
    name: string;
    item: string;
    subject: string;
    group_no: number;
    track_changes?: string;
    idx: number;
  }>;
  error?: string;
  message?: string;
  enrollment_data?: {
    name: string;
    enrollment_date: string;
    program: string;
    academic_year: string;
    student_group: string;
  };
  count?: number;
}

export const useStudentCustomLearning = (studentId: string) => {
  return useCustom<{ message: StudentCustomLearningResponse }>({
    url: "/api/method/unity_parent_app.api.student.get_student_custom_learning",
    method: "get",
    config: {
      query: {
        student_id: studentId,
      },
    },
    queryOptions: {
      queryKey: ["studentCustomLearning", studentId],
      enabled: !!studentId && studentId.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      retryDelay: 1000,
    },
    errorNotification: undefined,
    successNotification: undefined,
  });
};

export default useStudentCustomLearning; 