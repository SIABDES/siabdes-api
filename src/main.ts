import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    origin: '*',
  });

  const config = await app.get(ConfigService);

  app.setGlobalPrefix('/api/v1');

  const port = config.get('PORT') || 8080;
  const logger: Logger = new Logger('Bootstrap');

  await app.listen(port, '::');

  logger.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
