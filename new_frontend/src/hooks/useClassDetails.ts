import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ClassDetails {
  division: {
    student_group_name: string;
    name: string;
    custom_school: string;
    academic_year: string;
    program: string;
  };
  program: {
    program_name: string;
    name: string;
    wiki_link?: string;
  };
  class: {
    subject: {
      subject: string;
    }[];
    name: string;
  };
}

const fetchClassDetails = async (student: string, academic_year?: string) => {
  const params = { student };
  if (academic_year) params["academic_year"] = academic_year;

  const response = await axios.get("/api/method/unity_parent_app.api.cmap.get_student_class_details", {
    params,
  });

  return response.data.message as ClassDetails;
};

export const useClassDetails = (student: string, academic_year?: string) => {
  return useQuery({
    queryKey: ["classDetails", student, academic_year],
    queryFn: () => fetchClassDetails(student, academic_year),
    enabled: !!student,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

