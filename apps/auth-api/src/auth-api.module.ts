import { Module } from '@nestjs/common';
import { AuthApiController } from './auth-api.controller';
import { AuthApiService } from './auth-api.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { GoogleStrategy } from './auth/strategies/google.strategy';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [AuthApiController, AuthController],
  providers: [AuthApiService, GoogleStrategy],
})
export class AuthApiModule { }
