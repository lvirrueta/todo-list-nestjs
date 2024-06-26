import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('To Do List')
    .setDescription('App To Do List')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    //.addSecurity('basic', {type: 'http',scheme: 'basic'})
    //.addOAuth2()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      filter: true,
      persistAuthorization: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(json({ limit: '50mb' }));

  await app.listen(3000);
}
bootstrap();
