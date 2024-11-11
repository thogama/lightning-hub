import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LightningAuthGuard extends AuthGuard('lightning') {
  canActivate(context: ExecutionContext) {
    
    return super.canActivate(context);
  }
}
