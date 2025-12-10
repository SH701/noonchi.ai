export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  gender: string;
  birthDate: string;
  profileImageUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GuestLoginRequest {
  deviceId: string;
}
