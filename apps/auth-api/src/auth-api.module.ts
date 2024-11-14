import { Module } from '@nestjs/common';
import { AuthApiController } from './auth-api.controller';
import { AuthApiService } from './auth-api.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { LightningStrategy } from './auth/strategies/lightning.strategy';
import { LightningRpcService } from '@app/lightning-rpc';
import { SchemesModule } from '@app/schemes';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: "lightning-api" }),
    SchemesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      
    }),
  ],
  controllers: [AuthApiController, AuthController],
  providers: [AuthApiService, GoogleStrategy, LightningStrategy, LightningRpcService],
})
export class AuthApiModule { }
