import { Role } from '@common/enums';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
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

    @IsEnum(Role)
    @IsNotEmpty()
    role: string;
}