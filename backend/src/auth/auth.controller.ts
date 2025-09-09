// src/auth/auth.controller.ts
import type { Response } from 'express';
import { Controller, Get, Post, UseGuards, Req, Res, UnauthorizedException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
//import { AuthGuard } from './auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AuthGuard } from './guards/auth.guard';
import { LocalAuthGuard } from "./local/local-auth.guard"
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GoogleGuard } from './guards/google.guard';
import { HeaderAccessTokenGuard } from './guards/headerAccess.guard';

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
      sameSite: 'lax',
      secure: false, // true in production
      //    maxAge: 2 * 60 * 1000,
      maxAge: 15 * 60 * 1000, // 15 minutes

    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      //  maxAge: 20 * 60 * 1000, // 20 min
      sameSite: 'lax',
      secure: false, // false for development
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
      sameSite: 'lax',
      secure: false, // true in production
      maxAge: 2 * 60 * 1000,
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      // maxAge: 7 * 24 * 60 * 60 * 1000,
      maxAge: 20 * 60 * 1000,
      sameSite: 'lax',
      secure: false, // false for development
      path: '/', // ✅ required so it is sent to all paths
    });

    return { access_token: access_token };
    // res.redirect(`${process.env.Frontend_Domain}/dashboard`);
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
console.log("UUSER",user)
    if (!user) return res.status(401).send({ message: 'Invalid credentials' });
    const result = await this.authService.googleLogin(user);

    const { access_token, refresh_token } = this.authService.getTokens(result);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true, // true in production
      maxAge: 2 * 60 * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      // maxAge: 7 * 24 * 60 * 60 * 1000,
      maxAge: 20 * 60 * 1000,
      sameSite: 'lax',
      secure: true, // false for development
      path: '/', // ✅ required so it is sent to all paths
    });
    console.log(access_token, 'rrt', refresh_token)
    // Send access token to frontend via redirect or frontend call
    res.redirect(`${process.env.Frontend_Domain}/dashboard`);
    //  return { access_token: access_token };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {

    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }

  // @Get('test-cookies')
  // test(@Req() req) {
  //   //   console.log('Cookies received:', req.cookies);
  //   return req.cookies;
  // }


  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const access_token = this.authService.getAccessTokens(user);
    return { access_token: access_token };
  }

  @Post('debug-refresh')
  debugRefresh(@Req() req) {
    const token = req.cookies?.refresh_token;
    const access_token = this.authService.Debug(token);
    console.log('debug', access_token)
  }


  @UseGuards(HeaderAccessTokenGuard)
  //@UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    console.log("profile", req.user)
    return req.user;
  }

}
