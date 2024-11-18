import { Injectable, ExecutionContext, CanActivate, UnauthorizedException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthApiGuard implements CanActivate {

  constructor(@Inject() private readonly configService: ConfigService) { }


  authApi = this.configService.get<string>('AUTH_API');

  private async validateTokenWithAuthApi(token: string) {
    const response = await fetch(`${this.authApi}/auth/validate-token`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    })

    const data = response.json();

    return data
  }


  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');

    try {

      const authResponse = await this.validateTokenWithAuthApi(token);

      if (!authResponse.valid) {
        throw new UnauthorizedException('Invalid or expired token');
      }


      request.user = authResponse.user;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token validation failed: ' + err.message);
    }
  }

}
