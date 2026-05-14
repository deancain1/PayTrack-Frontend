export interface AuthResponse {
    fullName: string,
    email: string,
    token: string,        // lowercase
    refreshToken: string,
    userId: string,
    role: string,
}
