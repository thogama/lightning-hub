import { NestFactory } from '@nestjs/core';
import { AuthApiModule } from './auth-api.module';

async function bootstrap() {

  const router = await NestFactory.create(AuthApiModule);
  
  await router.listen(3001)
}
bootstrap();
