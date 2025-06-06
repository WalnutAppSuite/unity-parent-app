import { useCustom } from "@refinedev/core";

const useFeesAcademicYear = (student: string) => {
  return useCustom<{ message: string[] }>({
    config: {
      query: {
        student,
      },
    },
    errorNotification: undefined,
    method: "get",
    queryOptions: {
      queryKey: ["fees", "academic-year", "list", student],
    },
    successNotification: undefined,
    url: "/api/method/unity_parent_app.api.fee.get_academic_year_with_fees",
  });
};

export default useFeesAcademicYear;
