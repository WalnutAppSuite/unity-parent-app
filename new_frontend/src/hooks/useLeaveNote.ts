import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

export interface LeaveNoteVariables {
    note: string;
    status: "sick" | "leave";
    student: string;
    end_date: string;
    start_date: string;
    dates: string[];
    program: string;
}

const addLeaveNote = async (variables: LeaveNoteVariables) => {
    const response = await axiosInstance.post(
        "/api/method/unity_parent_app.api.leave.add_leave_note",
        variables
    );
    return response.data;
};

const useLeaveNote = () => {
    return useMutation({
        mutationFn: addLeaveNote,
    });
};

export default useLeaveNote;
