import { useCustom } from "@refinedev/core";

export interface Observation {
    name: string;
    subject: string;
    observation_type: string;
    observation_label: string;
    marks: number;
    scale: number;
    remarks: string;
    period: number; // Added this field
    grade?: string;
    date?: string;
    class_average: number;
    division_average: number;
    total_marks: number;
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
        url: "/api/method/unity_parent_app.api.observation.get_observations",
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