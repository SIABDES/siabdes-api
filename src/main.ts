import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = await app.get(ConfigService);

  app.setGlobalPrefix('/api/v1');

  const port = config.get('PORT') || 8080;

  await app.listen(port, '0.0.0.0');

  console.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
