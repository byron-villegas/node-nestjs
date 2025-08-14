import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(httpException: HttpException, host: ArgumentsHost) {

    console.log('HttpExceptionFilter: ', httpException);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = httpException.getStatus();
    const responseBody = httpException.getResponse();

    response.status(status).json(responseBody);
  }
}