import { useMutation } from '@tanstack/react-query'

import { sendOTP, verifyOTP } from '@/features/auth/api/otp.api'

export const useSendOTP = () => {
  return useMutation({
    mutationFn: (email: string) => sendOTP(email),
  })
}

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      verifyOTP(email, code),
  })
}
