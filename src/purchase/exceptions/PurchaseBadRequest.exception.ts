import { HttpException, HttpStatus } from '@nestjs/common';

export class PurchaseBadRequestException extends HttpException {
  constructor() {
    super('Cannot create purchase', HttpStatus.BAD_REQUEST);
  }
}
