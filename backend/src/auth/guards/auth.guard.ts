
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from '../constants';
  import { Request } from 'express';
  import { Reflector } from '@nestjs/core'
  import {IS_PUBLIC_KEY} from '../decorators/public.decorator';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
    
      const token = this.extractTokenFromHeader(request)
      console.log("TOKENs",token)

   

      if (!token) {
      
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: jwtConstants.secret
          }
        );
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        console.log("GUARD")
        request['user'] = payload;
      } catch {
        throw new UnauthorizedException('vvdf');
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.cookie?.split('=') ?? [];

     // return type === 'Bearer' ? token : undefined;
     return token
    }
  }
  