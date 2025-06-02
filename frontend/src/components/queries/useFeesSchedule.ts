import { useCustom } from "@refinedev/core";

export interface FeesSchedule {
  payment_term: string;
  payment_amount: number;
  due_date: string;
}

const useFeesSchedule = (student: string, academic_year: string | null) => {
  return useCustom<{ message: FeesSchedule[] }>({
    config: {
      query: {
        student,
        academic_year,
      },
    },
    errorNotification: undefined,
    method: "get",
    queryOptions: {
      queryKey: ["fees-schedule", "list", student, academic_year],
      enabled: !!student,
    },
    successNotification: undefined,
    url: "/api/method/unity_parent_app.api.fee.get_student_fee_schedule",
  });
};

export default useFeesSchedule;
