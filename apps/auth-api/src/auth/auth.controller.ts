import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from "../guards/google-oauth.guard";
import { LightningAuthGuard } from '../guards/lightning.guard';
import { randomBytes } from 'crypto';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }
    @Get('google-login')
    @UseGuards(GoogleOauthGuard)
    googleAuth() {
        // initiates the google oauth flow
    }

    @Get('google')
    @UseGuards(GoogleOauthGuard)
    googleAuthRedirect(@Req() req: any) {
        return this.authService.createUserOnFirstLoginGoogle(req.user);
    }
    

    @Post('lightning')
    @UseGuards(LightningAuthGuard)
    async lightningAuth(@Req() req: any) {
        return this.authService.createUserOnFirstLoginLightning(req.user);
    }

    @Get('lightning')
    async lightning() {
        const challenge = randomBytes(32).toString('hex');
        return challenge
    }

    @Post('refresh-token')
    async refreshToken(@Payload() payload: any) {
        return this.authService.refreshToken(payload);
    }

    @Post('validate-token')
    async validateToken(@Payload() token: string) {
        return {
            valid: true
        }

    }
}
