import { Role } from '@common/enums';
import { Equals, IsEmail, IsEnum, IsOptional } from 'class-validator';

export class PatchUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    name?: string;

    @IsOptional()
    password?: string;

    @IsOptional()
    avatar?: string;

    @IsOptional()
    phone_number?: string;

    @IsOptional()
    address?: string;

    @Equals(Role.CUSTOMER)
    @IsOptional()
    role?: string;
}