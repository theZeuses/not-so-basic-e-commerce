import { IsBoolean, IsOptional } from 'class-validator';

export class PatchCartDto {
    @IsOptional()
    user_id?: number;

    @IsOptional()
    @IsBoolean()
    followedUp: boolean;
}