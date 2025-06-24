import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

export interface ObservationEntry {
    name: string;
    docstatus: number;
    idx: number;
    date: string;
    period_number: number;
    grade: string;
    remarks: string | null;
}

export interface SubjectObservation {
    name: string;
    subject: string;
    observation_type: string;
    observation_label: string;
    marks: number;
    Table: ObservationEntry[];
    total_marks: number;
}

export type ObservationsBySubject = Record<string, SubjectObservation[]>;

async function fetchObservationData(student_id: string, unit: string): Promise<ObservationsBySubject> {
    const response = await axiosInstance.get("/api/method/unity_parent_app.api.observation.get_observations", {
        params: { student_id, unit },
    });
    return response.data.message.observations_by_subject;
}

export function useObservation(studentId: string, unit: string) {
    return useQuery<ObservationsBySubject>({
        queryKey: ["observations", studentId, unit],
        queryFn: () => fetchObservationData(studentId, unit),
        retry: 1,
        enabled: !!studentId && !!unit,
    });
}
