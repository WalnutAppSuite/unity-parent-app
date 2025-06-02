import { useInfiniteQuery } from "@tanstack/react-query";
import { BaseRecord } from "@refinedev/core";

export interface Notice extends BaseRecord {
  name: string;
  subject: string;
  notice: string;
  students?: string[];
  is_read?: boolean;
  is_archived?: boolean;
  is_stared?: boolean;
}

interface NoticeListProps {
  archivedOnly?: boolean;
  staredOnly?: boolean;
  search_query?: string;
  limit?: number;
}

interface Cursor {
  creation: string;
  name: string;
}

const useNoticeList = (props: NoticeListProps) => {
  return useInfiniteQuery<{
    message: {
      notices: Notice[];
      next_cursor: Cursor | null;
      has_more: boolean;
    };
  }>(
    ["student", "list", props.staredOnly, props.archivedOnly],
    async ({ pageParam }) => {
      const response = await fetch(
        `/api/method/edu_quality.public.py.walsh.notices.get_all_notices?${new URLSearchParams(
          {
            stared_only: props.staredOnly?.toString() || "",
            archived_only: props.archivedOnly?.toString() || "",
            cursor_name: pageParam?.name || "",
            cursor_creation: pageParam?.creation || "",
            search_query: props?.search_query || "",
            // cursor: pageParam ? JSON.stringify(pageParam) : "",
            limit: String(props.limit || 10),
          }
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to get list");
      }

      return response.json();
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.message.has_more) return undefined;
        return lastPage.message.next_cursor;
      },
    }
  );
};
export default useNoticeList;
