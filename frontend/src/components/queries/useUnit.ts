import { useCustom } from "@refinedev/core";

export interface Unit {
  name: string;
}

const useUnitList = () => {
  return useCustom<{ data: Unit[] }>({
    config: {
      query: {},
    },
    errorNotification: undefined,
    method: "get",
    queryOptions: {
      queryKey: ["unit", "list"],
    },
    successNotification: undefined,
    url: "/api/resource/Unit",
  });
};

export default useUnitList;