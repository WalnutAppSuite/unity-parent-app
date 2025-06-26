import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

interface NoticeDetailsParams {
    id: string;
    student: string;
}

export function useNoticeDetails({ id, student }: NoticeDetailsParams) {
    return useQuery({
        queryKey: ["noticeDetails", id, student],
        queryFn: async () => {
            const { data } = await axiosInstance.get(
                "/api/method/edu_quality.public.py.walsh.notices.get_notice_by_id",
                { params: { id, student } }
            );
            return data.message;
        },
        enabled: !!id && !!student,
    });
}

export default useNoticeDetails;