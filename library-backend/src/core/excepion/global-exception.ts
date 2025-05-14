import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalException implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;
    const request = ctx.getRequest<Request>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const response = {
      message:
        exception instanceof HttpException
          ? exception.message
          : 'Unknown error occured',
      statuscode: statusCode,
      path: request.url,
      timeStamp: new Date().toISOString(),
    };
    console.error(`Error on ${request.url}: `, exception);
    httpAdapter.reply(ctx.getResponse<Response>(), response, statusCode);
  }
}
