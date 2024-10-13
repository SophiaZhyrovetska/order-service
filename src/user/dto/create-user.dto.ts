import { IsEmail, IsOptional, IsObject } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsObject()
  marketingData?: Record<string, any>;
}
