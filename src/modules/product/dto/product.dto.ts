import { IsNotEmpty, IsOptional } from 'class-validator';

export class ProductDto {
    @IsOptional()
    id?: number;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    photo: string;

    @IsOptional()
    quantity?: number;

    @IsOptional()
    quantity_unit?: string;

    @IsOptional()
    weight?: number;

    @IsOptional()
    weight_unit?: string;

    @IsNotEmpty()
    isPublished: boolean;

    @IsOptional()
    description?: string;

    @IsOptional()
    type?: string;

    @IsOptional()
    rating?: number;

    @IsNotEmpty()
    category_id: number;

    @IsOptional()
    created_at?: Date

    @IsOptional()
    updated_at?: Date
}