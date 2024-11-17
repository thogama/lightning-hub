import { NestFactory } from '@nestjs/core';
import { AuthApiModule } from './auth-api.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthApiModule, {
    transport: Transport.TCP,
  });
  app.listen()
}
bootstrap();
