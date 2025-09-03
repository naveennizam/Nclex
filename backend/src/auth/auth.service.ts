// src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      await this.usersService.updateLastLogin(user.id);
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }



  async register(email: string, password: string, name: string) {
    // ✅ Check if email already exists
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      return 'Email already in use'
    }
    const user = await this.usersService.createUser(email, password, name);

    return user
  }
  // googleLogin(req) {
  //   console.log("GOGLE_LOGIN",req.user)
  //   if (!req.user) return ("No google user")
  //   return {
  //     message: "Google In fo from User",
  //     user: req.user
  //   }
  // }


  async googleLogin(user: any) {
    const existing = await this.usersService.findByEmail(user.email);
  
    let record
    if (existing) {
      record=  await this.usersService.updateLastLogin(existing.id);
    
      return record
    }
    else   return  await this.usersService.createUserByGoogle(user)
  }

  // async googleLogin(email: string, password: string, name: string) {
  //   ✅ Check if email already exists
  //   const existing = await this.usersService.findByEmail(email);
  //   if (existing) {
  //   return  'Email already in use'
  //   }
  //   const user =await  this.usersService.createUser(email, password, name);

  //   return user
  // }

  // LOGIN
  // async validateUser(email: string, password: string) {
  //   const user = await this.usersService.findByEmail(email);
  //   console.log('validateUser', user)
  //   if (!user) throw new UnauthorizedException('Credientials not valid')

  //   const match = await bcrypt.compare(password, user?.password);
  //   if (!match) throw new UnauthorizedException();

  //   return user

  // }

  getTokens(user: any) {
    const payload = { email: user.email, sub: user.id, name: user.name };
    const access_token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.accessTokenExpiresIn,
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.refreshTokenExpiresIn,
    });
    return { access_token, refresh_token };
  }

  getAccessTokens(user: any) {
//    console.log('getAccessTokens', user)
    const payload = { email: user.email, sub: user.id, name: user.name };
    const access_token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.accessTokenExpiresIn,
    });

    return access_token;
  }





  async Debug(token) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
    //  console.log(' Manually verified token:', payload);
      return payload;
    } catch (err) {
      console.error(' Manual token verify error:', err.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}




