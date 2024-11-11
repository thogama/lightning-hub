import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from "../guards/google-oauth.guard";
import { LightningAuthGuard } from '../guards/lightning.guard';

@Controller('auth')
export class AuthController {

    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async googleAuth() { }

    @Get('google-redirect')
    @UseGuards(GoogleOauthGuard)
    googleAuthRedirect(@Req() req: any) {
        return {
            statusCode: req.user ? 200 : 401,
            message: req.user ? 'Usuário autenticado com sucesso' : 'Falha na autenticação',
            user: req.user,
        }
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
}
