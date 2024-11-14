import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from "../guards/google-oauth.guard";
import { LightningAuthGuard } from '../guards/lightning.guard';
import { randomBytes } from 'crypto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {     
    }

    @Get('google')
    @UseGuards(GoogleOauthGuard)
    googleAuth() {
        // initiates the google oauth flow
    }

    @Get('google-redirect')
    @UseGuards(GoogleOauthGuard)
    googleAuthRedirect(@Req() req) {
        return this.authService.createUserOnFirstLoginGoogle(req.user);
    }

    @Post('lightning')
    @UseGuards(LightningAuthGuard)
    async lightningAuth(@Req() req: any) {
        return {
            statusCode: req.user ? 200 : 401,
            message: req.user ? 'Usuário autenticado com sucesso' : 'Falha na autenticação',
            user: req.user,
        };
    }

    @Get('lightning')
    @UseGuards()
    async lightning(@Req() req: any) {
        const challenge = randomBytes(32).toString('hex');
        return challenge
    }

}
