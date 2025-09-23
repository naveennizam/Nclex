import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import {DbModule} from '../db/db.module'
@Module({
  imports: [DbModule], 
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
