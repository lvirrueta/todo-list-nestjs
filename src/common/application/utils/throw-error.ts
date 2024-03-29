import { HttpException, HttpStatus } from '@nestjs/common';

export class ThrowError {
  public static httpException(error: IError) {
    const { statusCode } = error;
    throw new HttpException(error, statusCode);
  }
}

interface IError {
  message: string;
  statusCode: HttpStatus;
  errorCode: string;
}
