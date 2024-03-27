// Dependencies
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Module Imports
import { AuthModule } from './auth/auth.module';
import { ConfigAppModule } from './config/config.module';
import { ToDoListModule } from './todo-list/todo-list.module';

// Service Imports
import { LogService } from './common/domain/service/log.service';

// Repository
import { LogRepository } from './common/infrastructure/log.repository';

// Guards
import { JwtAuthGuard } from './auth/application/guards/jwt.auth.guard';

// Interceptor
import { LogInterceptor } from './common/application/interceptor/log.interceptor';

@Module({
  imports: [AuthModule, ConfigAppModule, ToDoListModule],
  providers: [
    LogService,
    LogRepository,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
  ],
})
export class AppModule {}
