import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbModule } from 'src/db/db.module';
import {JwtHeaderStrategy} from './strategies/jwtHeaderAccess.strategy'

@Module({
  imports: [DbModule],
  providers: [UsersService,JwtHeaderStrategy],
  controllers: [UsersController], // ✅ Needed for route handling
  exports: [UsersService], // ✅ Useful if other modules need UsersService
})
export class UsersModule {}
