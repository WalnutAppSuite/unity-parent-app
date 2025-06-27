import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Notice } from '@/types/notice';

interface StarNoticeParams {
    notice: string;
    student: string;
    stared: boolean;
}

interface ArchiveNoticeParams {
    notice: string;
    student: string;
    archived: boolean;
}

interface ReadNoticeParams {
    notice: string;
    student: string;
    read: boolean;
}

interface ApiResponse {
    message: any;
}

const useNoticeActions = () => {
    const queryClient = useQueryClient();

    // Star/Unstar Notice Mutation
    const starNoticeMutation = useMutation({
        mutationFn: async (params: StarNoticeParams): Promise<ApiResponse> => {
            const response = await fetch('/api/method/unity_parent_app.api.notices.mark_as_stared', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            console.log("star clicked ")
            if (!response.ok) {
                throw new Error('Failed to star/unstar notice');
            }

            return response.json();
        },
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["notices"] });
        },
        onError: (error) => {
            console.error('Star/unstar operation failed:', error);
        },
    });


    const archiveNoticeMutation = useMutation({
        mutationFn: async (params: ArchiveNoticeParams): Promise<ApiResponse> => {
            const response = await fetch('/api/method/unity_parent_app.api.notices.mark_as_archived', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                throw new Error('Failed to archive/unarchive notice');
            }

            return response.json();
        },
        onSuccess: () => {
            // Invalidate and refetch all notice queries
            queryClient.invalidateQueries({ queryKey: ["notices"] });
        },
        onError: (error) => {
            console.error('Archive/unarchive operation failed:', error);
        },
    });




    // Helper functions to call the mutations
    const toggleStar = (notice: Notice) => {
        starNoticeMutation.mutate({
            notice: notice.name,
            student: notice.student,
            stared: notice.is_stared === 0, // If 0 (not starred), send true; if 1 (starred), send false
        });
    };

    const toggleArchive = (notice: Notice) => {
        archiveNoticeMutation.mutate({
            notice: notice.name,
            student: notice.student,
            archived: notice.is_archived === 0, // If 0 (not archived), send true; if 1 (archived), send false
        });
    };



    return {
        // Functions to call
        toggleStar,
        toggleArchive,


        // Loading states
        isStarring: starNoticeMutation.isPending,
        isArchiving: archiveNoticeMutation.isPending,


        // Error states
        starError: starNoticeMutation.error,
        archiveError: archiveNoticeMutation.error,


        // Success states
        isStarSuccess: starNoticeMutation.isSuccess,
        isArchiveSuccess: archiveNoticeMutation.isSuccess,


        // Reset functions
        resetStarMutation: starNoticeMutation.reset,
        resetArchiveMutation: archiveNoticeMutation.reset,

    };
};

export default useNoticeActions;