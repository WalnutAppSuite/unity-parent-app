import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface EventItem {
  id: string;
  folder: string;
  title: string;
  date: string;
  description: string;
  thumbnail: string;
  imageCount: number;
}

/**
 * Hook to fetch events from a specific folder for a student
 * Properly handles potential nested message format
 * Uses direct axios POST request to ensure proper payload format
 */
const useEvents = (folder: string, studentId?: string) => {
  return useQuery({
    queryKey: ["events", folder, studentId],
    queryFn: async () => {
      const response = await axios.post(
        "/api/method/unity_parent_app.api.event.get_events",
        {
          folder: folder || "",
          student_id: studentId || "",
        },
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
        return (data.message as { message: EventItem[] }).message || [];
      }

      return data.message || [];
    },
    enabled: !!folder,

    refetchOnWindowFocus: true,
  });
};

export default useEvents;
