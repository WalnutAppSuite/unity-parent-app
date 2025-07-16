import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

// Send OTP to email
export function useSendOtpToEmail() {
  return useMutation<{ success?: boolean }, Error, { email: string }>({
    mutationFn: async ({ email }) => {
      const res = await axiosInstance.post('/api/method/unity_parent_app.api.student_profile.send_otp_to_email_address', {
        email_address: email,
      });
      return res.data;
    },
  });
}

// Send OTP to mobile
export function useSendOtpToMobile() {
  return useMutation<{ success?: boolean }, Error, { mobile: string }>({
    mutationFn: async ({ mobile }) => {
      const res = await axiosInstance.post('/api/method/unity_parent_app.api.student_profile.send_otp_to_mobile_number', {
        mobile_number: mobile,
      });
      return res.data;
    },
  });
}

// Verify OTP for email
export function useVerifyOtpEmail() {
  return useMutation<{ success?: boolean; message?: string }, Error, { otp: string; email: string }>({
    mutationFn: async ({ otp, email }) => {
      const res = await axiosInstance.post('/api/method/unity_parent_app.api.student_profile.verify_otp', {
        otp,
        email,
      });
      
      // Check if the response contains an error
      if (res.data?.message?.error) {
        throw new Error(JSON.stringify(res.data.message));
      }
      
      return res.data;
    },
  });
}

// Verify OTP for mobile
export function useVerifyOtpMobile() {
  return useMutation<{ success?: boolean; message?: string }, Error, { otp: string; mobile: string }>({
    mutationFn: async ({ otp, mobile }) => {
      const res = await axiosInstance.post('/api/method/unity_parent_app.api.student_profile.verify_otp_mobile', {
        otp,
        phone_no: mobile,
      });
      
      // Check if the response contains an error
      if (res.data?.message?.error) {
        throw new Error(JSON.stringify(res.data.message));
      }
      
      return res.data;
    },
  });
} 