export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
    needsRegistration: boolean;
    errors: any[];
    accessToken?: string;
}