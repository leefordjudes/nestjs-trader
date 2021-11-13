import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Types } from 'mongoose';

import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'auth-jwt') {
  constructor(config: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-auth-token'),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_PRIVATE_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    const user = await this.authService.findById(
      new Types.ObjectId(payload.uid),
    );
    if (!user) {
      return false;
    }
    return {
      id: user.id,
      accessId: user.accessId,
      accessKey: user.accessKey,
    };
  }
}
