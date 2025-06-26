import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

export interface AcademicYearItem {
    academic_year: string;
    program: string;
    student_group: string;
}

const fetchAcademicYears = async (student: string): Promise<AcademicYearItem[]> => {
    if (!student) return [];

    try {
        const response = await axiosInstance.get('/api/resource/Program Enrollment', {
            params: {
                filters: JSON.stringify([
                    ["student", "=", student],
                    ["docstatus", "=", "1"]
                ]),
                fields: JSON.stringify(["academic_year", "student_group", "program"])
            }
        });

        const data = response.data;
        console.log("Academic Years Data:", data);
        if (data.data && Array.isArray(data.data)) {
            return data.data.map((item: any) => ({
                academic_year: item.academic_year || '',
                program: item.program || '',
                student_group: item.student_group || '',
            }));
        } else if (data.message && data.message.error) {
            console.error(data.message.error);
            return [];
        }
        return [];
    } catch (error) {
        console.error("Error fetching academic years:", error);
        return [];
    }
};

export const useAcademicYears = (student: string) => {
    return useQuery<AcademicYearItem[]>({
        queryKey: ['academic_years', student],
        queryFn: () => fetchAcademicYears(student),
        enabled: !!student,
    });
};
