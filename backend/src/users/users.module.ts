

// users.module.ts

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports  : [DbModule],
  providers: [UsersService],
//  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
