import { useCustomMutation } from "@refinedev/core";
import { useCallback } from "react";

interface EarlyPickUpNoteVariables {
  note?: string;
  status: "early_pickup";
  student: string;
  dates: string[];
  date: string;
  time: string;
  program: string;
}

const useEarlyPickUpMutation = () => {
  const { mutate, mutateAsync, ...mutationObjs } = useCustomMutation({
    mutationOptions: {},
  });
  const mutationFunction = useCallback(
    (variables: EarlyPickUpNoteVariables) => {
      return mutate({
        url: "/api/method/unity_parent_app.api.leave.add_early_pick_up",
        method: "post",
        values: variables,
      });
    },
    [mutate]
  );
  const mutationAsyncFunction = useCallback(
    (variables: EarlyPickUpNoteVariables) => {
      return mutateAsync({
        url: "/api/method/unity_parent_app.api.leave.add_early_pick_up",
        method: "post",
        values: variables,
      });
    },
    [mutateAsync]
  );
  return {
    ...mutationObjs,
    mutate: mutationFunction,
    mutateAsync: mutationAsyncFunction,
  };
};

export default useEarlyPickUpMutation;
