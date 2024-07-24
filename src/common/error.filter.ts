/**
 * @docs : exception filter to change the error/httpcode according to our wishes
 * we for example response zod error default nest 500
 * and we want 400 nahh that's where the exception error is needed
 */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      response.status(400).json({
        errors: exception.errors,
      });
    } else {
      response.status(500).json({
        errors: exception.message,
      });
    }
  }
}
