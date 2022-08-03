import { IsNotEmpty, IsOptional } from 'class-validator';

export class CategoryDto {
    @IsOptional()
    id?: number;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    icon: string;

    @IsOptional()
    created_at?: Date

    @IsOptional()
    updated_at?: Date
}