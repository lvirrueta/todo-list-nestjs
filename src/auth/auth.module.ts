import { Module } from '@nestjs/common';
import { SignController } from './application/controller/auth-sign.controller';
import { AuthService } from './domain/service/auth-sign.service';
import { UserRepository } from './infrastructure/repository/auth.repository';

@Module({
  imports: [],
  controllers: [SignController],
  providers: [AuthService, UserRepository],
  exports: [],
})
export class AuthModule {}
