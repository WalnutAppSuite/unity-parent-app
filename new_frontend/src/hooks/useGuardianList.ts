import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export interface Guardian {
    first_name: string
    last_name: string
    guardian_name: string
    email_address: string
    mobile_number: string
    annual_income: string
    name: string
    relation: string
    address_line_1: string
}

interface Student_ID {
    student_id: string
}

interface MotherId {
    name: string
}

interface FatherId {
    name: string
}

interface FatherDetailsProps {
    FatherGuardian: string
}

interface GuardianEmailvariables {
    name: string
    email_address: string
}

interface GuardianNumbervariables {
    name: string
    mobile_number: string
}

interface GuardianFatherNumbervariables {
    name: string
    mobile_number: string
}

interface GuardianAddress {
    name: string
    address_line_1: string
}

interface GuardianAddress2 {
    name: string
    address_line_2: string
}

interface UpdateBloodGroupProps {
    name: string
    blood_group: string
}

interface UpdateAnnualIncomeProps {
    name: string
    annual_income: string
}

// GET hooks converted from useCustom to useQuery
export const useStudentDataList = (props: Student_ID) => {
    return useQuery({
        queryKey: ["studentDataList", props.student_id],
        queryFn: async () => {
            const response = await fetch(`/api/resource/Student/${props.student_id}?student_id=${props.student_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch student data');
            }
            return response.json();
        },
        enabled: !!props.student_id,
    });
}

export const useDetailsList = (student_id: string) => {
    return useQuery({
        queryKey: ["DetailsDataList", student_id],
        queryFn: async () => {
            const response = await fetch(`/api/method/unity_parent_app.api.student.get_student_data?student=${student_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch details');
            }
            return response.json();
        },
        enabled: !!student_id,
    });
}

export const useMotherGuardianList = (props: MotherId) => {
    return useQuery({
        queryKey: ["guardianMotherData", props.name],
        queryFn: async () => {
            const response = await fetch(`/api/resource/Guardian/${props.name}?name=${props.name}`);
            if (!response.ok) {
                throw new Error('Failed to fetch mother guardian data');
            }
            return response.json();
        },
        enabled: !!props.name,
    });
}

export const useFatherGuardianList = (props: FatherId) => {
    return useQuery({
        queryKey: ["guardianFatherData", props.name],
        queryFn: async () => {
            const response = await fetch(`/api/resource/Guardian/${props.name}?name=${props.name}`);
            if (!response.ok) {
                throw new Error('Failed to fetch father guardian data');
            }
            return response.json();
        },
        enabled: !!props.name,
    });
}

// Mutation hooks converted from useCustomMutation to useMutation
export const guardin_email_update = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (variables: GuardianEmailvariables) => {
            const response = await fetch(`/api/resource/Guardian/${variables.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(variables),
            });
            if (!response.ok) {
                throw new Error('Failed to update email');
            }
            return response.json();
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ["DetailsDataList"] });
            queryClient.invalidateQueries({ queryKey: ["guardianMotherData"] });
            queryClient.invalidateQueries({ queryKey: ["guardianFatherData"] });
        },
    });

    const mutationFunction = useCallback((variables: GuardianEmailvariables) => {
        return mutation.mutate(variables);
    }, [mutation.mutate]);

    const mutationAsyncFunction = useCallback((variables: GuardianEmailvariables) => {
        return mutation.mutateAsync(variables);
    }, [mutation.mutateAsync]);

    return {
        ...mutation,
        mutate: mutationFunction,
        mutateAsync: mutationAsyncFunction
    };
}

export const guardian_number_update = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (variables: GuardianNumbervariables) => {
            const response = await fetch(`/api/resource/Guardian/${variables.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(variables),
            });
            if (!response.ok) {
                throw new Error('Failed to update number');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["DetailsDataList"] });
            queryClient.invalidateQueries({ queryKey: ["guardianMotherData"] });
            queryClient.invalidateQueries({ queryKey: ["guardianFatherData"] });
        },
    });

    const mutationFunction = useCallback((variables: GuardianNumbervariables) => {
        return mutation.mutate(variables);
    }, [mutation.mutate]);

    const mutationAsyncFunction = useCallback((variables: GuardianNumbervariables) => {
        return mutation.mutateAsync(variables);
    }, [mutation.mutateAsync]);

    return {
        ...mutation,
        mutate: mutationFunction,
        mutateAsync: mutationAsyncFunction
    };
}

export const guardin_father_number_update = ({ FatherGuardian }: FatherDetailsProps) => {
    const queryClient = useQueryClient();
    const urls = `/api/resource/Guardian/${FatherGuardian}`;
    console.log("check url", urls);

    const mutation = useMutation({
        mutationFn: async (variables: GuardianFatherNumbervariables) => {
            const response = await fetch(`/api/resource/Guardian/${variables.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(variables),
            });
            if (!response.ok) {
                throw new Error('Failed to update father number');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["DetailsDataList"] });
            queryClient.invalidateQueries({ queryKey: ["guardianFatherData"] });
        },
    });

    const mutationFunction = useCallback((variables: GuardianFatherNumbervariables) => {
        return mutation.mutate(variables);
    }, [mutation.mutate]);

    const mutationAsyncFunction = useCallback((variables: GuardianFatherNumbervariables) => {
        return mutation.mutateAsync(variables);
    }, [mutation.mutateAsync]);

    return {
        ...mutation,
        mutate: mutationFunction,
        mutateAsync: mutationAsyncFunction
    };
}

export const guardin_address = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (variables: GuardianAddress) => {
            const response = await fetch(`/api/resource/Student/${variables.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(variables),
            });
            if (!response.ok) {
                throw new Error('Failed to update address');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["DetailsDataList"] });
            queryClient.invalidateQueries({ queryKey: ["studentDataList"] });
        },
    });

    const mutationFunction = useCallback((variables: GuardianAddress) => {
        return mutation.mutate(variables);
    }, [mutation.mutate]);

    const mutationAsyncFunction = useCallback((variables: GuardianAddress) => {
        return mutation.mutateAsync(variables);
    }, [mutation.mutateAsync]);

    return {
        ...mutation,
        mutate: mutationFunction,
        mutateAsync: mutationAsyncFunction
    };
}

export const guardin_address2 = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (variables: GuardianAddress2) => {
            const response = await fetch(`/api/resource/Student/${variables.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(variables),
            });
            if (!response.ok) {
                throw new Error('Failed to update address 2');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["DetailsDataList"] });
            queryClient.invalidateQueries({ queryKey: ["studentDataList"] });
        },
    });

    const mutationFunction = useCallback((variables: GuardianAddress2) => {
        return mutation.mutate(variables);
    }, [mutation.mutate]);

    const mutationAsyncFunction = useCallback((variables: GuardianAddress2) => {
        return mutation.mutateAsync(variables);
    }, [mutation.mutateAsync]);

    return {
        ...mutation,
        mutate: mutationFunction,
        mutateAsync: mutationAsyncFunction
    };
}

export const updateBloodGroup = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (variables: UpdateBloodGroupProps) => {
            const response = await fetch(`/api/resource/Student/${variables.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(variables),
            });
            if (!response.ok) {
                throw new Error('Failed to update blood group');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["DetailsDataList"] });
            queryClient.invalidateQueries({ queryKey: ["studentDataList"] });
        },
    });

    const mutationFunction = useCallback((variables: UpdateBloodGroupProps) => {
        return mutation.mutate(variables);
    }, [mutation.mutate]);

    const mutationAsyncFunction = useCallback((variables: UpdateBloodGroupProps) => {
        return mutation.mutateAsync(variables);
    }, [mutation.mutateAsync]);

    return {
        ...mutation,
        mutate: mutationFunction,
        mutateAsync: mutationAsyncFunction
    };
}

export const updateAnnualIncome = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (variables: UpdateAnnualIncomeProps) => {
            const response = await fetch(`/api/resource/Guardian/${variables.name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(variables),
            });
            if (!response.ok) {
                throw new Error('Failed to update annual income');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["DetailsDataList"] });
            queryClient.invalidateQueries({ queryKey: ["guardianMotherData"] });
            queryClient.invalidateQueries({ queryKey: ["guardianFatherData"] });
        },
    });

    const mutationFunction = useCallback((variables: UpdateAnnualIncomeProps) => {
        return mutation.mutate(variables);
    }, [mutation.mutate]);

    const mutationAsyncFunction = useCallback((variables: UpdateAnnualIncomeProps) => {
        return mutation.mutateAsync(variables);
    }, [mutation.mutateAsync]);

    return {
        ...mutation,
        mutate: mutationFunction,
        mutateAsync: mutationAsyncFunction
    };
}