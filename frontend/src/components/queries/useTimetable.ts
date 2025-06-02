import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface TimetableResponse {
  message: {
    success: boolean;
    data: {
      student_group: string;
      timetable: Record<
        string,
        Record<
          string,
          { time: string; instructor: string; subject: string; room: string , room_number: string; }[]
        >
      >;
    };
    error?: string;
  };
}
const API_URL = "/api/method/edu_quality.api.timetable.get_timetable_data";

const fetchTimetable = async (
  studentGroup: string
): Promise<TimetableResponse["message"]["data"]> => {
  if (!studentGroup) throw new Error("Student Group is required");

  const response = await axios.get<TimetableResponse>(API_URL, {
    params: { student_group: studentGroup },
  });

  const message = response.data.message;

  if (!message.success || !message.data) {
    throw new Error(message.error || "Failed to fetch timetable");
  }

  return message.data;
};

const useFetchTimeTable = (studentGroup: string) => {
  return useQuery({
    queryKey: ["timetable", studentGroup],
    queryFn: () => fetchTimetable(studentGroup),
    enabled: !!studentGroup,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

export default useFetchTimeTable;
