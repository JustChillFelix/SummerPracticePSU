import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let errorMessage: string;
    let errorName: string;

    if (typeof errorResponse === 'string') {
      errorMessage = errorResponse;
      errorName = errorResponse;
    } else if (
      typeof errorResponse === 'object' &&
      errorResponse !== null &&
      'message' in errorResponse &&
      'error' in errorResponse
    ) {

      errorMessage = String((errorResponse as Record<string, unknown>).message);
      errorName = String((errorResponse as Record<string, unknown>).error);
    } else {
      errorMessage = 'Internal server error';
      errorName = 'Internal Error';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorName,
      message: errorMessage,
    });
  }
}