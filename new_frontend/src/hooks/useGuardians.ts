import type { Guardian } from '@/types/students';

export function useGuardians(guardians: Guardian[] | undefined) {
    const getGuardianByRelation = (relation: string) =>
        guardians?.find(guardian => guardian.relation === relation);

    return {
        mother: getGuardianByRelation('Mother'),
        father: getGuardianByRelation('Father'),
    };
} 