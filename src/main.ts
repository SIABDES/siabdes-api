import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { patchNestJsSwagger } from 'nestjs-zod';
import { V1Module } from '~modules/v1/v1.module';
import { V2Module } from '~modules/v2/v2.module';
import { AppModule } from './app.module';

function initSwagger(app: INestApplication) {
  // Open API (Swagger)
  patchNestJsSwagger();
  const swaggerV1Options = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('SIABDes TAXion API v1')
    .addBearerAuth()
    .build();
  const swaggerV1Document = SwaggerModule.createDocument(
    app,
    swaggerV1Options,
    {
      deepScanRoutes: true,
      include: [V1Module],
    },
  );
  SwaggerModule.setup('docs/v1', app, swaggerV1Document);

  const swaggerV2Options = new DocumentBuilder()
    .setVersion('2.0')
    .setTitle('SIABDes TAXion API v2')
    .addBearerAuth()
    .build();
  const swaggerV2Document = SwaggerModule.createDocument(
    app,
    swaggerV2Options,
    {
      deepScanRoutes: true,
      include: [V2Module],
    },
  );
  SwaggerModule.setup('docs/v2', app, swaggerV2Document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    origin: '*',
  });

  // API Versioning
  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Swagger
  initSwagger(app);

  // Start the app
  const config = app.get(ConfigService);
  const port = config.get('PORT') || 8080;
  const logger: Logger = new Logger('Bootstrap');

  await app.listen(port, '0.0.0.0');

  logger.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
