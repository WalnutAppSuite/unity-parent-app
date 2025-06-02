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
 * Hook to fetch all events for a student directly
 * Uses direct axios POST request to ensure proper payload format
 */
const useAllEvents = (studentId: string) => {
  return useQuery(
    ["all_events", studentId],
    async () => {
      // Get all available folders for this student
      const foldersResponse = await axios.post(
        "/api/method/unity_parent_app.api.event.get_event_folders",
        { student_id: studentId || "" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const folders = foldersResponse.data.message || [];
      if (!Array.isArray(folders) || folders.length === 0) {
        return [];
      }

      // For each folder, get all events
      const allEventsPromises = folders.map((folder) =>
        axios.post(
          "/api/method/unity_parent_app.api.event.get_events",
          {
            folder: folder,
            student_id: studentId || "",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      );

      const responses = await Promise.all(allEventsPromises);

      // Combine all events from all folders
      let allEvents: EventItem[] = [];
      responses.forEach((response) => {
        const events = response.data.message || [];
        if (Array.isArray(events)) {
          allEvents = [...allEvents, ...events];
        }
      });

      // Sort events by date (newest first)
      allEvents.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      return allEvents;
    },
    {
      enabled: !!studentId,

      refetchOnWindowFocus: true,
    }
  );
};

export default useAllEvents;
