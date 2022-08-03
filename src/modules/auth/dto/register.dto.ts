import { Role } from '@common/enums';
import { IsEmail, IsNotEmpty, IsOptional, Equals } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    avatar?: string;

    @IsOptional()
    phone_number?: string;

    @IsNotEmpty()
    address: string;

    @Equals(Role.CUSTOMER)
    @IsNotEmpty()
    role: string;
}