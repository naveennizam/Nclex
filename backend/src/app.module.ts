import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { QuizModule } from './quiz/quiz.module';
import { TestModule } from './test/test.module';
@Module({
  imports: [AuthModule, UsersModule,ConfigModule.forRoot(), QuizModule, TestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



