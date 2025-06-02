import { useCustom } from "@refinedev/core";

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
    wiki_link ?:string;
  };
  class: {
    subject: [
      {
        subject: string;
      }
    ];
    name: string;
  };
}

const useClassDetails = (student: string, academic_year?: any) => {
  return useCustom<{ message: ClassDetails }>({
    config: {
      query: {
        student,
        academic_year,
      },
    },
    errorNotification: undefined,
    method: "get",
    queryOptions: {
      queryKey: ["student", "list", student, academic_year],
      enabled: !!student,
    },
    successNotification: undefined,
    url: "/api/method/edu_quality.public.py.walsh.cmap.get_student_class_details",
  });
};

export default useClassDetails;
