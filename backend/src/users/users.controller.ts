// users.controller.ts

import { Controller, Get, Post, UseGuards, Req, Res, Query, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { HeaderAccessTokenGuard } from './guards/jwtHeaderAccess.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    const user = await this.usersService.findByEmail(username);
    return { available: !user };
  }

  @UseGuards(HeaderAccessTokenGuard)
  @Post('update-profile')
  async updateProfile(@Body() body: any, @Req() req) {

    let { name, email } = body
    await this.usersService.UserEditName(name, email);

    return { message: 'Profile updated successfully' };


  }

  @UseGuards(HeaderAccessTokenGuard)
  @Post('update-password')
  async updatePassword(@Body() body: any, @Req() req) {

    let { curr_password, new_password } = body
    if (curr_password === new_password) {
      throw new BadRequestException('New password cannot be same as current password');
    }

    return this.usersService.UserEditPassword(req.user.email, curr_password, new_password);

  }

}
