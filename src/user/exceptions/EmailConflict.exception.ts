import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailConflictException extends HttpException {
  constructor() {
    super('User with this email alredy exists', HttpStatus.CONFLICT);
  }
}
