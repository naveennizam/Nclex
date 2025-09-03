// src/auth/refresh-token.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import  { Request } from 'express';
import { jwtConstants } from '../constants';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

  constructor() {
    super({jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
      //    console.log('COOKIE Refresh:', req?.cookies.refresh_token);
          return req?.cookies?.refresh_token;
        },
      ]),
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true, // ✅ this is required to access `req` in `validate()`
    });
  }

  async validate(req: Request, payload: any) {
    console.group('RefreshTokenStrategy',payload)
  if (!payload?.sub || !payload?.email) {
    console.warn('⚠️ Invalid token payload');
    return null;
  }

    console.log({ userId: payload.sub, email: payload.email })
    return { userId: payload.sub, email: payload.email };   
}
}
