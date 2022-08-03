import { Role } from '@common/enums';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class UserDto {
    @IsOptional()
    id?: number;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

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

    @IsOptional()
    created_at?: Date;

    @IsOptional()
    updated_at?: Date;
}