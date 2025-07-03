import { useInfiniteQuery } from "@tanstack/react-query";
import type { Notice } from '@/types/notice';

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

interface NoticeListResponse {
    message: {
        notices: Notice[];
        next_cursor: Cursor | null;
        has_more: boolean;
    };
}

const useNoticeList = (props: NoticeListProps) => {
    return useInfiniteQuery({
        queryKey: ["notices", props.staredOnly, props.archivedOnly, props.search_query],
        queryFn: async ({ pageParam }: { pageParam?: Cursor }) => {
            const params = new URLSearchParams({
                cursor_name: pageParam?.name || "",
                cursor_creation: pageParam?.creation || "",
                search_query: props?.search_query || "",
                limit: String(props.limit || 10),
            });

            if (props.staredOnly) {
                params.set("stared_only", "true");
            }
            if (props.archivedOnly) {
                params.set("archived_only", "true");
            }

            const response = await fetch(`/api/method/unity_parent_app.api.notices.get_all_notices?${params}`);

            if (!response.ok) {
                throw new Error("Failed to fetch notice list");
            }

            return response.json();
        },
        getNextPageParam: (lastPage: NoticeListResponse) =>
            lastPage.message.has_more ? lastPage.message.next_cursor : undefined,
        initialPageParam: undefined,
    });
};

export default useNoticeList;