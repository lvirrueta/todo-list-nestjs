import { Module } from '@nestjs/common';
import { SignController } from './application/controller/auth-sign.controller';
import { AuthService } from './domain/service/auth-sign.service';
import { UserRepository } from './infrastructure/repository/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './application/strategies/jwt-strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('CONFIG_JWT_SECRET'),
        };
      },
    }),
  ],
  controllers: [SignController],
  providers: [AuthService, UserRepository, JwtStrategy],
  exports: [JwtStrategy, JwtModule],
})
export class AuthModule {}
