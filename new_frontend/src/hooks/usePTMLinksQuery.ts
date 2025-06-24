import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

interface PTMLink {
    meeting_url: string;
    meeting_title: string;
    start_time: string;
    end_time: string;
}

async function fetchPTMLinks(student_id: string): Promise<PTMLink[]> {
    const response = await axiosInstance.get("/api/method/unity_parent_app.api.cmap_jobs.get_upcoming_online_ptm_links", {
        params: { student_id },
    });

    return response.data.message as PTMLink[];
}

export function usePTMLinks(studentId: string) {
    return useQuery({
        queryKey: ["onlinePTMList", studentId],
        queryFn: () => fetchPTMLinks(studentId),
        retry: 1,
        enabled: !!studentId,
    });
}
