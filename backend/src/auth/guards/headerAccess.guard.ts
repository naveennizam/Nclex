// guards/header-access.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class HeaderAccessTokenGuard extends AuthGuard('jwt-header') {
  handleRequest(err, user) {
  
    if (err || !user) {
      throw err || new UnauthorizedException('Header token invalid');
    }
    return user;
  }
}
