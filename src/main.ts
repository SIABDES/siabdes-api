import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    origin: '*',
  });

  const config = await app.get(ConfigService);

  app.setGlobalPrefix('/api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const port = config.get('PORT') || 8080;
  const logger: Logger = new Logger('Bootstrap');

  await app.listen(port, '0.0.0.0');

  logger.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
