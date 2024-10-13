import { HttpException, HttpStatus } from '@nestjs/common';

export class UserBadRequestException extends HttpException {
  constructor() {
    super('Cannot create the user', HttpStatus.BAD_REQUEST);
  }
}
