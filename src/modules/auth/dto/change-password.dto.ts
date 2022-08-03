import {
    IsEmail,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class ChangePasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    new_password: string;
  }
  