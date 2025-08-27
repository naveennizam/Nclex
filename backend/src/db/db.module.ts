// db.module.ts
import { Module } from '@nestjs/common';
import { DbService } from './db.service';

@Module({
  providers: [DbService],
  exports: [DbService], // 👈 makes it available to other modules
})
export class DbModule {}
