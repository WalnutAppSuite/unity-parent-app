import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

interface LoginResponse {
  message: string;
}

interface LoginPayload {
  usr: string;
  pwd: string;
}

export default function useAuth() {
  const mutation = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async ({ usr, pwd }) => {
      const response = await axiosInstance.post("/api/method/login", {
        usr,
        pwd,
      });
      return response.data;
    },
    onSuccess: (data) => {
      alert("Login Successful: " + data.message);
    },
    onError: (error) => {
      alert("Login Failed: " + error.message);
    },
  });

  return mutation;
}