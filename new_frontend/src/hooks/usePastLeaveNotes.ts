import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface LeaveNoteData {
    reason: string;
    date: string;
}

const fetchPastLeaveNotes = async (student: string): Promise<LeaveNoteData[]> => {
    const { data } = await axios.get("/api/method/unity_parent_app.api.leave.get_past_pick_ups", {
        params: { student },
    });
    return data.message || [];
};

const usePastLeaveNotes = (student: string) => {
    return useQuery({
        queryKey: ["past-leave-note", "list", student],
        queryFn: () => fetchPastLeaveNotes(student),
        enabled: !!student,
        retry: 1,
    });
};

export default usePastLeaveNotes;