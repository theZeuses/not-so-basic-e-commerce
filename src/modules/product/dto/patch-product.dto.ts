import { IsOptional } from 'class-validator';

export class PatchProductDto {
    @IsOptional()
    name: string;

    @IsOptional()
    price: number;

    @IsOptional()
    photo: string;

    @IsOptional()
    quantity?: number;

    @IsOptional()
    quantity_unit?: string;

    @IsOptional()
    weight?: number;

    @IsOptional()
    weight_unit?: number;

    @IsOptional()
    isPublished: boolean;

    @IsOptional()
    description?: string;

    @IsOptional()
    type?: string;

    @IsOptional()
    rating?: number;

    @IsOptional()
    category_id: number;
}