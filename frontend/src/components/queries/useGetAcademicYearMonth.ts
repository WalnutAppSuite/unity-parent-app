import { useQuery } from "react-query";

const fetchAcademicYearMonths = async (student_id: string) => {
  const response = await fetch(
    `/api/method/unity_parent_app.api.leave.get_academic_year_months?student_id=${student_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

export const useGetAcademicYearMonth = (student_id: string) => {
  return useQuery({
    queryKey: ["academicYearMonths", student_id],
    queryFn: () => fetchAcademicYearMonths(student_id),
    staleTime: 1000 * 60 * 5,
    enabled: !!student_id,
  });
};
