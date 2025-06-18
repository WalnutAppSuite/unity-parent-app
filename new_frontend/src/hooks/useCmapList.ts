import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Subject {
  course: string;
  course_name: string;
}

interface Unit {
  name: string;
}

interface AcademicYear {
  academic_year: string;
  student_group: string;
  program: string;
}

interface CmapFilters {
  academic_years: AcademicYear[];
  units: Unit[];
  subjects?: Subject[];
}

type CmapFiltersResponse = Record<string, CmapFilters>;

interface UseCmapListProps {
  type: string;
  studentIds: string[];
}

async function fetchCmapFilters({ type, studentIds }: UseCmapListProps) {
  const response = await axios.post('/api/method/unity_parent_app.api.cmap.get_cmap_filters', {
    type,
    studentIds,
  });
  return response.data.message as CmapFiltersResponse;
}

export function useCmapFilters({ type, studentIds }: UseCmapListProps) {
  return useQuery({
    queryKey: ['cmap-filters', type, studentIds],
    queryFn: () => fetchCmapFilters({ type, studentIds }),
    enabled: !!type && studentIds.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
}