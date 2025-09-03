
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {

constructor() {
    super({jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
       //   console.log('COOKIE JWT:', req?.cookies?.access_token);
          return req?.cookies?.access_token;
        },
      ]),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
  //  console.log("VAL*DAT",payload)
    return { userId: payload.sub, email: payload.email };   
  }
}


// // src/auth/strategies/jwt.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { jwtConstants } from '../constants';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: jwtConstants.secret,
//     });
//   }

//   async validate(payload: any) {
//     return { userId: payload.sub, email: payload.email };
//   }
// }



