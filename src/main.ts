import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SqlConneciton } from './config/sqlconnection.config';

async function bootstrap() {
  await SqlConneciton.getConnection().connect();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
