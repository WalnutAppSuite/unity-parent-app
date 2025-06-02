import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Hook to fetch event folders for a student
 * Properly handles nested message objects that might be returned from backend
 * Uses direct axios POST request to ensure proper payload format
 */
const useEventFolders = (studentId: string) => {
  return useQuery(
    ["event", "folders", studentId],
    async () => {
      const response = await axios.post(
        "/api/method/edu_quality.public.py.walsh.event.get_event_folders",
        { student_id: studentId || "" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Extract and normalize data
      const data = response.data;

      // Handle case where API returns { message: { message: [] } }
      if (
        data?.message &&
        typeof data.message === "object" &&
        "message" in data.message
      ) {
        return (data.message as { message: string[] }).message || [];
      }

      return data.message || [];
    },
    {
      enabled: !!studentId,
      refetchOnWindowFocus: true,
    }
  );
};

export default useEventFolders;
