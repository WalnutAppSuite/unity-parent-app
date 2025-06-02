import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface EventImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
}

export interface EventDetail {
  id: string;
  title: string;
  date: string;
  description: string;
  thumbnail: string;
  images: EventImage[];
  imageCount: number;
}

interface EventDetailsResponse {
  event: EventDetail;
  success: boolean;
  message?: string;
}

/**
 * Hook to fetch details for a specific event
 * Uses direct axios POST request to ensure proper payload format
 */
const useEventDetails = (eventId: string) => {
  return useQuery<EventDetailsResponse>(
    ["event_details", eventId],
    async () => {
      const response = await axios.post(
        "/api/method/unity_parent_app.api.event.get_event_details",
        { event_id: eventId || "" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Extract response data
      const data = response.data?.message;
      console.log(data, "event-page");
      // If the event is not found or there's an error, return an empty response
      if (!data || !data.success || !data.event) {
        return {
          event: {} as EventDetail,
          success: false,
          message: data?.message || "Event not found",
        };
      }

      return data;
    },
    {
      enabled: !!eventId,
      refetchOnWindowFocus: false,
    }
  );
};

export default useEventDetails;