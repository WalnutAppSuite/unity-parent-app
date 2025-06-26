import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchStudentAcademicYear = async (student: string) => {
    const { data } = await axios.get("/api/method/unity_parent_app.api.fee.get_academic_year_with_fees", {
        params: { student },
    });
    return data.message || [];
};

const useStudentAcademicYear = (student: string) => {
    return useQuery({
        queryKey: ["past-leave-note", "list", student],
        queryFn: () => fetchStudentAcademicYear(student),
        enabled: !!student,
        retry: 1,
    });
};

export default useStudentAcademicYear;