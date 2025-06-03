import { useCustom } from "@refinedev/core";

export interface Student {
  name: string;
  first_name: string;
  reference_number: string;
  school: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  religion: string;
  caste: string;
  sub_caste: string;
  mother_tongue: string;
  address_line_1: string;
  address_line_2: string;
  enquired_class: string;
  blood_group: string;
  annual_income: string;
  student_name: string;
  image: string;
  student_email_id: string;
  program: string;
  custom_division: string;
  custom_calendar_link?: string | null;
  pincode: string;
  school_house: string;
  nationality: string;
  city: string;
}

const useStudentList = ({ enabled }: { enabled?: boolean } = {}) => {
  return useCustom<{ message: Student[] }>({
    url: "/api/method/unity_parent_app.api.cmap.get_students",
    method: "get",
    queryOptions: {
      queryKey: ["student", "list"],
      staleTime: 600000,
      cacheTime: 1200000,
      refetchOnWindowFocus: true,
      refetchInterval: 600000,
      enabled,
    },
    config: undefined,
    errorNotification: undefined,
    successNotification: undefined,
  });
};

export default useStudentList;
