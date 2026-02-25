import config from '@/lib/config'

interface ISendOTPResponse {
  success: boolean
  message: string
}

interface IVerifyOTPResponse {
  success: boolean
  message: string
}

export async function sendOTP(email: string): Promise<ISendOTPResponse> {
  const response = await fetch(`${config.lanegapWebUrl}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to send OTP')
  }

  return data
}

export async function verifyOTP(
  email: string,
  code: string,
): Promise<IVerifyOTPResponse> {
  const response = await fetch(`${config.lanegapWebUrl}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Invalid code')
  }

  return data
}
