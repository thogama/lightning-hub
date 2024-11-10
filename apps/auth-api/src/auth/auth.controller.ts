import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from "../google-oauth/google-oauth.guard";

@Controller('auth')
export class AuthController {

    @Get()
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
}
