import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export async function fetchTimetableData(student_group: string) {
    const params = new URLSearchParams({ student_group });
    const response = await axiosInstance(`/api/method/unity_parent_app.api.timetable.get_timetable_data?${params.toString()}`);
    return response.data.message?.data;
}

export function useTimetable(student_group: string) {
    return useQuery({
        queryKey: ['timetable', student_group],
        queryFn: () => fetchTimetableData(student_group),
    });
}