import { useQuery } from '@tanstack/react-query';
import axiosInstance from "@/utils/axiosInstance";
import type { MainData } from '@/types/weekly';

export interface Subject {
  course: string;
  course_name: string;
}

export interface Unit {
  name: string;
  value: string;
}

export interface AcademicYear {
  academic_year: string;
  student_group: string;
  program: string;
}

export interface CmapProductItemData {
    name: string;
    item_code: string;
    item_name: string;
    item_group: string;
    custom_product_url?: string;
    [key: string]: any;
  }
  
  export interface CmapProduct {
    name: string;
    item: string;
    item_group: string;
    chapter?: string;
    item_data : CmapProductItemData;
    [key: string]: any;
  }
  
  export interface Cmap {
    name: string;
    academic_year: string;
    subject: string;
    unit: string;
    products: CmapProduct[];
    [key: string]: any;
  }

interface CmapFilters {
  academic_years: AcademicYear[];
  units: Unit[];
  subjects?: Subject[];
}

interface UseCmapListProps {
  type: string;
  studentId: string;
}

interface Product {
  name: string;
  url: string | null;
}

interface CmapItem {
  cmap_name: string;
  subject: string;
  reserved_for_portion_circular: number;
  chapter: string;
  textbook: string;
  item_group: string;
  count: number;
  item_names: string;
  item_urls: string;
  products: Product[];
}

type ChapterMap = {
  [chapterName: string]: CmapItem[];
};
type TextbookMap = {
  [textbookName: string]: ChapterMap;
};

export type CmapListType = {
  [subjectName: string]: TextbookMap;
};

async function fetchCmapFilters({ type, studentId }: UseCmapListProps): Promise<CmapFilters> {
  const response = await axiosInstance.post('/api/method/unity_parent_app.api.cmap.get_cmap_filters', {
    type,
    studentId,
  });
  return response.data.message as CmapFilters;
}

export function useCmapFilters({ type, studentId }: UseCmapListProps) {
  return useQuery({
    queryKey: ['cmap-filters', type, studentId],
    queryFn: () => fetchCmapFilters({ type, studentId }),
    enabled: !!type && !!studentId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

async function fetchCmapList(subject: string, unit: string, division: string): Promise<Cmap[]> {
  const response = await axiosInstance.post('/api/method/unity_parent_app.api.cmap.get_all_cmaps', {
    subject,
    unit,
    division,
  });
  return response.data.message as Cmap[];
}

export function useCmapList(subject: string, unit: string, division: string) {
  return useQuery({
    queryKey: ['cmap',  'list', subject, unit, division],
    queryFn: () => fetchCmapList(subject, unit, division),
    enabled: !!subject && !!unit && !!division,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

async function fetchCmapPortion(unit: string, division: string): Promise<CmapListType> {
  const response = await axiosInstance.post('/api/method/unity_parent_app.api.cmap.get_portion_circulars', {
    unit,
    division,
  });
  return response.data.message as CmapListType;
}

export function useCmapPortion(unit: string, division: string) {
  return useQuery({
    queryKey: ['cmap', 'portion', unit, division],
    queryFn: () => fetchCmapPortion(unit, division),
    enabled: !!unit && !!division,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

async function fetchCmapWeekly(date: string, division: string){
  const response = await axiosInstance.get('/api/method/unity_parent_app.api.cmap.get_all_cmap_in_range', {
    params: {
      date,
      division,
    },
  });
  return response.data.message as  MainData;
}

export function useCmapWeekly(date: string, division: string) {
  return useQuery({
    queryKey: ['cmap', 'weekly', date, division],
    queryFn: () => fetchCmapWeekly(date, division),
    enabled: !!date && !!division,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
