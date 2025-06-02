import { useQuery } from "react-query";

interface AcademicYear {
  name: string;
  academic_year_name: string;
  year_start_date: string;
  year_end_date: string;
  custom_current_academic_year: number;
}

export const useAcademicYear = () => {
  const fetchCurrentAcademicYear = async () => {
    const response = await fetch(
      `/api/resource/Academic Year?filters=[["custom_current_academic_year","=",1]]&fields=["name","year_start_date","year_end_date","custom_current_academic_year"]`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch current academic year");
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data[0];
    }
    throw new Error("No current academic year found");
  };

  const {
    data: currentAcademicYear,
    isLoading,
    error,
    refetch,
  } = useQuery<AcademicYear, Error>(
    "currentAcademicYear",
    fetchCurrentAcademicYear,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  return {
    currentAcademicYear,
    isLoading,
    error,
    refetch,
  };
};

export interface EnrollmentData {
  academic_year: string;
  student_group: string;
  program: string;
}

export const useStudentEnrollmentYears = (studentId: string) => {
  const { currentAcademicYear } = useAcademicYear();

  const fetchEnrollmentYears = async (
    studentId: string
  ): Promise<EnrollmentData[]> => {
    if (!studentId) return [];

    try {
      const response = await fetch(
        `/api/resource/Program Enrollment?filters=[["student","=","${studentId}"],["docstatus","=","1"]]&fields=["academic_year","student_group","program"]`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch academic years");
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching academic years:", error);
      throw error;
    }
  };

  const {
    data: years = [],
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["enrollmentYears", studentId],
    () => fetchEnrollmentYears(studentId),
    {
      enabled: !!studentId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Add current academic year if it's not in the list
  const allYears =
    currentAcademicYear &&
    !years.some((year) => year.academic_year === currentAcademicYear.name)
      ? [
          ...years,
          {
            academic_year: currentAcademicYear.name,
            student_group: "",
            program: "",
          },
        ]
      : years;

  // Find the current academic year in the student's enrollments
  const currentYearEnrollment = allYears.find(
    (year) =>
      currentAcademicYear && year.academic_year === currentAcademicYear.name
  );

  // Default to the first enrollment if current year not found
  const defaultYearEnrollment =
    currentYearEnrollment || (allYears.length > 0 ? allYears[0] : null);

  return {
    years: allYears,
    isLoading,
    error,
    refetch,
    currentYearEnrollment,
    defaultYearEnrollment,
  };
};
