import { useCustom } from "@refinedev/core";

export interface Table {
  name: string;
  docstatus: number;
  idx: number;
  date: string;
  period_number: number;
  grade: string;
  remarks: string;
}

export interface Observation {
  name: string;
  subject: string;
  observation_type: string;
  observation_label: string;
  marks: number;
  remarks: string;
  total_marks: number;
  class_average: number;
  division_average: number;
  Table: Table[];
}

export interface ObservationResponse {
  message: {
    observations_by_subject: {
      [subject: string]: Observation[];
    };
  };
}

const useObservationList = (studentId: string, unit?: string) => {
  return useCustom<ObservationResponse>({
    url: "/api/method/edu_quality.api.observation.get_observations",
    method: "get",
    config: {
      query: {
        student_id: studentId,
        ...(unit && { unit }),
      },
    },
    queryOptions: {
      queryKey: ["observations", studentId, unit],
      enabled: !!studentId,
    },
  });
};

export default useObservationList;