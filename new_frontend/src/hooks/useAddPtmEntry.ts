import axiosInstance from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

interface PTMEntryParams {
    student_id: string;
    gmeet_link: string;
    teacher: string;
}

const addPTMEntry = async (data: PTMEntryParams) => {
    const response = await axiosInstance.post(
        "/api/method/unity_parent_app.api.ptm.add_ptm_entry",
        data
    );
    return response.data;
};

export const useAddPTMEntry = () => {
    return useMutation({
        mutationFn: (data: PTMEntryParams) => addPTMEntry(data),
    });
};
