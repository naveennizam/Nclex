import { Injectable ,UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants'; // update path if needed
import { UsersService } from '../../users/users.service';
@Injectable()
export class JwtHeaderStrategy extends PassportStrategy(Strategy, 'jwt-header') {
  constructor(
    private readonly usersService: UsersService, // <-- Inject your DB-accessing service
  ) {
    super({
     
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ✅ from Authorization header
      secretOrKey: jwtConstants.secret,
     // passReqToCallback: true, // ✅ this is required to access `req` in `validate()`
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user; 
  }
}
