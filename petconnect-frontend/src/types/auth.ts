export type UserRole = 'owner' | 'walker' | 'admin';

export interface RatingInfo {
  average: number;
  count: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  twoFactorEnabled?: boolean;
  profilePicture?: string | null;
  rating?: RatingInfo;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  sessionToken?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: UserProfile;
    tokens?: AuthTokens;
  };
}


