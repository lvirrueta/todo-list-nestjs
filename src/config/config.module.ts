import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PSWD,
      database: process.env.DB_NAME,
      port: +process.env.DB_PORT,
      autoLoadEntities: true,
      synchronize: true,
      entities: [
        __dirname + '/../**/infrastructure/entities/*.entity.{js,ts}',
        __dirname + '/../**/infrastructure/entities/**/*.entity.{js,ts}',
      ],
      logging: 'all',
    }),
  ],
})
export class ConfigAppModule {}
