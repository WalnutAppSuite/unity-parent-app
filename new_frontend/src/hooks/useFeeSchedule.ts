import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

export interface FeesSchedule {
    payment_term: string;
    payment_amount: number;
    due_date: string;
}

const fetchFeesSchedule = async (
    student: string,
    academic_year: string | null
): Promise<FeesSchedule[]> => {
    const { data } = await axiosInstance.get("/api/method/unity_parent_app.api.fee.get_student_fee_schedule", {
        params: {
            student,
            academic_year,
        },
    });

    return data.message;
};

const useFeesSchedule = (student: string, academic_year: string | null) => {
    return useQuery({
        queryKey: ["fees-schedule", "list", student, academic_year],
        queryFn: () => fetchFeesSchedule(student, academic_year),
        enabled: !!student && !!academic_year,
    });
};

export default useFeesSchedule;
