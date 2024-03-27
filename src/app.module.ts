import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigAppModule } from './config/config.module';

@Module({
  imports: [AuthModule, ConfigAppModule],
})
export class AppModule {}
