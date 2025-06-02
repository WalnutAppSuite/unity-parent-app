import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
  thumbnail: string;
  imageCount: number;
}

export interface EventFilters {
  eventNameFilter?: string;
}

interface EventsResponse {
  events: EventItem[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * Hook to fetch all events for a student using infinite loading
 * Uses React Query's useInfiniteQuery to load more events as user scrolls
 */
const useStudentEvents = (studentId: string, filters: EventFilters = {}, pageSize = 12) => {
  return useInfiniteQuery<EventsResponse>({
    queryKey: ["student_events", studentId, filters],

    queryFn: async ({ pageParam = 1 }) => {
      // Convert pageParam to number if it's a string
      const page =
        typeof pageParam === "string"
          ? parseInt(pageParam, 10)
          : pageParam || 1;

      // Don't make API call if no student ID
      if (!studentId) {
        return {
          events: [],
          total: 0,
          page: page,
          page_size: pageSize,
        };
      }

      try {
        const response = await axios.post(
          "/api/method/unity_parent_app.api.event.get_student_events",
          {
            student_id: studentId,
            page,
            page_size: pageSize,
            event_name_filter: filters.eventNameFilter || "",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Extract the response data
        const data = response.data?.message;
        // Ensure we have a valid response object even if API returns unexpected format
        return {
          events: Array.isArray(data?.events) ? data.events : [],
          total: typeof data?.total === "number" ? data.total : 0,
          page: typeof data?.page === "number" ? data.page : page,
          page_size:
            typeof data?.page_size === "number" ? data.page_size : pageSize,
        };
      } catch (error) {
        // Return empty data on error
        console.error("Error fetching events:", error);
        return {
          events: [],
          total: 0,
          page: page,
          page_size: pageSize,
        };
      }
    },

    // Get the next page parameter from the previous page data
    getNextPageParam: (lastPage, allPages) => {
      // Safety check if lastPage is undefined
      if (
        !lastPage ||
        typeof lastPage.page !== "number" ||
        typeof lastPage.page_size !== "number" ||
        typeof lastPage.total !== "number"
      ) {
        return undefined;
      }

      // If we've loaded all pages, return undefined to signal the end
      const totalLoaded = allPages.reduce(
        (count, page) => count + (page.events?.length || 0),
        0
      );

      if (totalLoaded >= lastPage.total || lastPage.events.length === 0) {
        return undefined;
      }

      // Otherwise, return the next page number
      return lastPage.page + 1;
    },

    // Only enable the query if we have a studentId
    enabled: !!studentId,

    // Refetch settings
    refetchOnWindowFocus: false,
  });
};

export default useStudentEvents;