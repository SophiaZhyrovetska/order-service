import { IsInt } from 'class-validator';

export class CreatePurchaseDto {
  @IsInt()
  userId: number;

  @IsInt()
  offerId: number;
}
