import { IsOptional } from 'class-validator';

export class PatchCategoryDto {
    @IsOptional()
    name: string;

    @IsOptional()
    icon: string;
}