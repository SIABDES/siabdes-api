import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';

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

  await app.listen(port, '0.0.0.0');

  logger.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
