import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthContext } from '../common/global/auth.context';

@Injectable()
export class JwtAuthGuard extends AuthGuard('auth-jwt') {
  constructor(private auth: AuthContext) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, payload: any) {
    if (err || !payload) {
      throw err || new UnauthorizedException();
    }
    this.auth.user = payload;
    return payload;
  }
}
