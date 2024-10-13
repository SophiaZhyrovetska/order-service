import { HttpException, HttpStatus } from '@nestjs/common';

export class OfferNotFoundException extends HttpException {
  constructor() {
    super('Offer does not exist', HttpStatus.NOT_FOUND);
  }
}
