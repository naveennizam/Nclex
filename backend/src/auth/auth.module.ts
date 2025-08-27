import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import {JwtStrategy} from './strategies/jwt.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {RefreshTokenStrategy} from './strategies/refresh-token.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import {JwtHeaderStrategy} from './strategies/jwt-header.strategy'

import { DbModule } from 'src/db/db.module';
@Module({
  imports: [
    UsersModule,PassportModule,DbModule,
     JwtModule.register({  }),
    // JwtModule.register({
    //   global: true,
    //  secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '60s' },
    // }),
  ],
  providers: [AuthService,LocalStrategy,JwtStrategy,RefreshTokenStrategy,GoogleStrategy,JwtHeaderStrategy,
  //   {
  //   provide: APP_GUARD,
  //   useClass: JwtAuthGuard,
  // },
],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
