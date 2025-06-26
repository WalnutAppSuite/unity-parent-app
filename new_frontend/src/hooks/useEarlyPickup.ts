import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

interface EarlyPickUpNoteVariables {
  note?: string;
  status: "early_pickup";
  student: string;
  dates: string[];
  date: string;
  time: string;
  program: string;
}

const addEarlyPickUp = async (data: EarlyPickUpNoteVariables) => {
  const response = await axiosInstance.post(
    "/api/method/unity_parent_app.api.leave.add_early_pick_up",
    data
  );
  return response.data;
};

const useEarlyPickUpMutation = () => {
  return useMutation({
    mutationFn: addEarlyPickUp,
  });
};

export default useEarlyPickUpMutation;
