import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export interface PTMLink {
    name: string;
    creation: string;
    modified: string;
    modified_by: string;
    owner: string;
    docstatus: number;
    idx: number;
    academic_year: string;
    division: string;
    period: string;
    day: string;
    slot: string;
    gmeet_link: string;
    branch: string;
    group: string;
    subject: string;
    teacher_alias: string | null;
    teacher: string;
    date: string;
    is_gmeet_generated: number;
    is_notified: number;
    _user_tags: string | null;
    _comments: string | null;
    _assign: string | null;
    _liked_by: string | null;
    differential_learning_group: string;
    datetime: string;
}

export interface PTMLinksApiResponse {
    message: {
        data: PTMLink[];
        past_ptms: boolean;
    }
}

async function fetchPTMLinks(student_id: string): Promise<PTMLinksApiResponse> {
    const response = await axiosInstance.get<PTMLinksApiResponse>(
        "/api/method/unity_parent_app.api.cmap_jobs.get_upcoming_online_ptm_links",
        {
            params: { student_id },
        }
    );
    return response.data;
}

export function usePTMLinks(studentId: string) {
    return useQuery({
        queryKey: ["onlinePTMList", studentId],
        queryFn: () => fetchPTMLinks(studentId),
        retry: 1,
        enabled: !!studentId,
    });
}
