// src/auth/auth.controller.ts
import type { Response } from 'express';
import { Controller, Get, Post, UseGuards, Req, Res, UnauthorizedException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
//import { AuthGuard } from './auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AuthGuard } from './guards/auth.guard';
import { LocalAuthGuard } from "./local/local-auth.guard"
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GoogleGuard } from './guards/google.guard';
import { HeaderAccessTokenGuard } from './guards/headerAccess.guard';
import { CookieOptions } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('register')
  async RegisterAccount(@Body() body: any, @Req() req, @Res({ passthrough: true }) res: Response) {

    const user = this.authService.register(body.email, body.password, body.name);

    let data = await user
    //   console.log("DATA", data)
    if (data == undefined || data == 'Email already in use') return res.status(401).send({ message: data });
    let getToken = { email: data.email, id: data.id, name: data.name }
    const { access_token, refresh_token } = this.authService.getTokens(getToken);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true, // true in production
      //    maxAge: 2 * 60 * 1000,
      maxAge: 15 * 60 * 1000, // 15 minutes

    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      //  maxAge: 20 * 60 * 1000, // 20 min
      sameSite: 'none',
      secure: true, // false for development
      path: '/', // ✅ required so it is sent to all paths
    });

    return { access_token: access_token };

  }


  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {

    const user = req.user

    if (!user) return res.status(401).send({ message: 'Invalid credentials' });

    const { access_token, refresh_token } = this.authService.getTokens(user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'none', //lax
      secure: true, // true in production
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      //  maxAge: 20 * 60 * 1000,
      sameSite: 'none',  // lax
      secure: true, // false for development
      path: '/', // ✅ required so it is sent to all paths
    });

    return { access_token: access_token, user: user };
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth(@Req() req) {
    // This will redirect to Google login
  }

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {


    const user = req.user

    if (!user) return res.status(401).send({ message: 'Invalid credentials' });

    const result = await this.authService.googleLogin(user);

    const { access_token, refresh_token } = this.authService.getTokens(result);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true, // true in production
      // maxAge: 2 * 60 * 1000,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // maxAge: 20 * 60 * 1000,
      sameSite: 'none',
      secure: true, // false for development
      path: '/', // ✅ required so it is sent to all paths
    });

    res.redirect(`${process.env.Frontend_Domain}/dashboard`);

  }

  // @Post('logout')
  // logout(@Res({ passthrough: true }) res: Response) {
  //   console.log("LOGOUT")
  //   res.clearCookie('refresh_token');
  //   res.clearCookie('access_token');
  //   return { message: 'Logged out successfully' };
  // }

  @Post('logout')
logout(@Res({ passthrough: true }) res: Response) {
  console.log("LOGOUT");

  const cookieOptions: CookieOptions = {    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "none",
    path: '/', // must match the path used in res.cookie()
  };

  res.clearCookie('refresh_token', cookieOptions);
  res.clearCookie('access_token', cookieOptions);

  return { message: 'Logged out successfully' };
}

  // @Get('test-cookies')
  // test(@Req() req) {
  //   //   console.log('Cookies received:', req.cookies);
  //   return req.cookies;
  // }


  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const access_token = this.authService.getAccessTokens(user);
    // res.cookie('access_token', access_token, {
    //   httpOnly: true,
    //   sameSite: 'none',
    //   secure: true, // true in production
    //   // maxAge: 2 * 60 * 1000,
    //   maxAge: 15 * 60 * 1000, // 15 minutes
    // });
    const data = await this.authService.UserRecord(user.email);
    const payload = {
      id: data.id,
      email: data.email,
      role: data.role,
      image: data.image,
      name: data.name
    };
    return { access_token: access_token, user: payload };
  }


  @Post('debug-refresh')
  debugRefresh(@Req() req) {
    const token = req.cookies?.refresh_token;
    const access_token = this.authService.Debug(token);
    console.log('debug', access_token)
  }


  // @UseGuards(HeaderAccessTokenGuard)

  // @Get('profile')
  // async getProfile(@Req() req) {
  //   const userEmail = req.headers['x-user-email']; 
  //  const  user  =await this.authService.UserRecord(userEmail);
  //  const payload = {
  //   id: user.id,
  //   email: user.email,
  //   role: user.role,
  //   image: user.image,
  //   name:user.name
  // };
  // console.log(payload)
  //   return payload;
  // }

}
