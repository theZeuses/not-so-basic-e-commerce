import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CartDto {
    @IsOptional()
    id?: number;

    @IsOptional()
    user_id?: number;

    @IsNotEmpty()
    @IsBoolean()
    followedUp: boolean;

    @IsOptional()
    created_at?: Date

    @IsOptional()
    updated_at?: Date
}