import { useCustom } from "@refinedev/core";
import type { Cmap } from "./useCmapList";

const useWeeklyCmapList = (division: string, date: string) => {
  return useCustom<{ message: { [x: string]: { [x: string]: Cmap[] } } }>({
    config: {
      query: {
        division,
        date,
      },
    },
    errorNotification: undefined,
    method: "get",
    queryOptions: {
      queryKey: ["weeklyCmap", "list", date, division],
    },
    successNotification: undefined,
    url: "/api/method/unity_parent_app.api.cmap.get_all_cmap_in_range",
  });
};

export default useWeeklyCmapList;
