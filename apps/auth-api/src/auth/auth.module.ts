import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SchemesModule } from '@app/schemes';
import { JwtService } from '@nestjs/jwt';


@Module({
  providers: [AuthService,JwtService],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [SchemesModule],
})
export class AuthModule { }
