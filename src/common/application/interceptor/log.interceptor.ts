import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ILog } from 'src/common/domain/interface/log.interface';
import { LogService } from 'src/common/domain/service/log.service';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}
  public logger = new Logger(this.constructor.name);

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      map((data) => {
        const timeResponse = Date.now() - now;
        const log = this.assign(context, data, timeResponse);
        this.logService.createLog(log);
        return data;
      }),
    );
  }

  private assign(context: ExecutionContext, response: JSON, timeResponse: number): ILog {
    const request = context.switchToHttp().getRequest();

    return {
      id: undefined,
      response: response,
      body: request.body,
      url: request.url,
      user: request.user?.id,
      method: request.method,
      timeResponse,
      createdAt: new Date(),
    };
  }
}
