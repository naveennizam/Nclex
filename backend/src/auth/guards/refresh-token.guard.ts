// src/auth/refresh-token.guard.ts
import { AuthGuard } from '@nestjs/passport';
import { Injectable,UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
    handleRequest(err, user) {
    console.log('jwt-refresh',"ERR",err,"user",user)
        if (err || !!user) {
          throw err || new UnauthorizedException('Refresh token invalid');
        }
        return user;
      }
}

