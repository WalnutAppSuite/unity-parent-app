import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

export interface Fees {
    status: FeesStatus;
    grand_total: number;
    payment_term: string;
    payment_hash: string;
    due_date: string;
    payment_url: string;
    payment_amount: string;
    type: "fees" | "advance";
}

type FeesStatus =
    | "Draft"
    | "Requested"
    | "Initiated"
    | "Partially Paid"
    | "Payment Ordered"
    | "Paid"
    | "Failed"
    | "Cancelled";

const fetchFeesList = async (
    student: string,
    academic_year: string | null
): Promise<Fees[]> => {
    const { data } = await axiosInstance.get("/api/method/unity_parent_app.api.fee.get_student_fees", {
        params: {
            student,
            academic_year,
        },
    });

    return data.message;
};

const useFeesList = (student: string, academic_year: string | null) => {
    return useQuery({
        queryKey: ["fees", "list", student, academic_year],
        queryFn: () => fetchFeesList(student, academic_year),
        enabled: !!student && !!academic_year,
    });
};

export default useFeesList;
