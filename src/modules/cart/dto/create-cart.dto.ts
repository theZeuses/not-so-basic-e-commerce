import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCartDto {
    @IsOptional()
    user_id?: number;

    @IsNotEmpty()
    @IsBoolean()
    followedUp: boolean;
}