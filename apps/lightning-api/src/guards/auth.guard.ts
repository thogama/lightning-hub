import { Injectable, ExecutionContext, CanActivate, Inject, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AuthApiGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authApiClient: ClientProxy, 
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
   
      const authResponse = await this.validateTokenWithAuthApi(token);
      console.log(authResponse);
      if (!authResponse.valid) {
        throw new UnauthorizedException('Invalid or expired token');
      }

   
      request.user = authResponse.user;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token validation failed: ' + err.message);
    }
  }

  private validateTokenWithAuthApi(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authApiClient
        .send({ cmd: 'validate_token' }, { token })
        .subscribe({
          next: (response) => resolve(response),
          error: (err) => reject(err),
        });
    });
  }
}
