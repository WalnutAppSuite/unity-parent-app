import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

export interface Unit {
  name: string;
}

interface UnitsResponse {
  data: Unit[];
}

async function fetchUnits(): Promise<Unit[]> {
  const response = await axiosInstance.get<UnitsResponse>("/api/resource/Unit");
  return response.data.data;
}

export function useUnits() {
  return useQuery<Unit[]>({
    queryKey: ["units"],
    queryFn: fetchUnits,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
