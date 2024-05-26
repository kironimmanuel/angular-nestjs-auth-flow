import { HttpException, HttpStatus } from '@nestjs/common';

export class UniqueUserValueException extends HttpException {
  constructor(message: string) {
    super({ message }, HttpStatus.BAD_REQUEST);
  }
}
