import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigAppModule } from './config/config.module';
import { JwtAuthGuard } from './auth/application/guards/jwt.auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [AuthModule, ConfigAppModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
