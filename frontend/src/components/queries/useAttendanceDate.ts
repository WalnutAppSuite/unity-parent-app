import { useQuery } from "react-query";

interface AttendanceEvent {
  title: string;
  date: string;
  color: string;
}

const fetchAttendanceEvents = async (
  student_id: string,
  month: number,
  year: number,
  program: string
): Promise<AttendanceEvent[]> => {
  const url = `/api/method/unity_parent_app.api.leave.get_student_attendance_events?student_id=${student_id}&month=${month}&year=${year}&program=${program}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: { message: AttendanceEvent[] } = await response.json();
  console.log(data?.message);

  return data.message;
};

export const useAttendanceEvents = (
  student_id: string,
  month: number,
  year: number,
  program: string
) => {
  return useQuery({
    queryKey: ["attendanceEvents", student_id, month, year, program],
    queryFn: () => fetchAttendanceEvents(student_id, month, year, program),
    staleTime: 1000 * 60 * 5,
    enabled: !!student_id && !!program && !!month && !!year,
  });
};
