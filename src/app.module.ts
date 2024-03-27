import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigAppModule } from './config/config.module';
import { JwtAuthGuard } from './auth/application/guards/jwt.auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ToDoListModule } from './todo-list/todo-list.module';

@Module({
  imports: [AuthModule, ConfigAppModule, ToDoListModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
