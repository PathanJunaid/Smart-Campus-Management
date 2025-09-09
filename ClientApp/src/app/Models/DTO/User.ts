export interface UserDto {
    id: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    rollNO: number;
    email: string;
    created_At: Date;
    role: number;
    dob: string; 
    mobileNo: number;
    profilePicture?: string | null;
}