import { useCustom } from "@refinedev/core";

export const usePTMLinksQuery = (selectedStudent: string) => {
    const { data, error, ...rest } = useCustom({
        config: {
            query: {
                student_id: selectedStudent,
            },
        },
        errorNotification: false,
        successNotification: false,
        method: "get",
        queryOptions: {
            enabled: !!selectedStudent,
            queryKey: ["onlinePTMList", selectedStudent],
        },
        url: `/api/method/edu_quality.cmap_jobs.get_upcoming_online_ptm_links`,
    });

    return {
        data,
        error: error?.response?.data?.exception,
        ...rest,
    };
};

export const useOfflinePTMLinksQuery = (custom_school: string | undefined) => {
    const { data, error, ...rest } = useCustom({
        config: {
            query: {
                school: custom_school,
            },
        },
        errorNotification: false,
        successNotification: false,
        method: "get",
        queryOptions: {
            enabled: !!custom_school,
            queryKey: ["offlinePTMList", custom_school],
        },
        url: `/api/method/unity_parent_app.api.calendar.get_calender_events`,
    });

    return {
        data,
        error: error?.response?.data?.exception,
        ...rest,
    };
};
