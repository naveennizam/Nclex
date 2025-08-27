// users.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    const user = await this.usersService.findByEmail(username);
    return { available: !user };
  }
}
