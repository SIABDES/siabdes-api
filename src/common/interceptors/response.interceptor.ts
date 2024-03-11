import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { CommonResponse } from '~common/types/responses';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, CommonResponse<T>>
{
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<CommonResponse<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
