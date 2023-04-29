export interface AuthSession {
  userId: string;
  email?: string;
  name?: string;
  profilePicture?: string;
  lastLoggedInAt?: Date;
  expireAt?: Date;
  authToken?: string;
  refreshToken?: string;
}
