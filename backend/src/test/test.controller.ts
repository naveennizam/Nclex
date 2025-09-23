import { TestService } from './test.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('get-quiz')
  async addQuizQuestion(@Body() body: any) {
      try {
        
       let data=   await this.testService.getQuestions(body);
          return { message: data };
      } catch (error) {

          return { message: ' Failed to add quiz question' };
      }
  }
  @Post('submit-answers')
  async submitAnswers(@Body() body: any) {
    const result = body; 
   return this.testService.insertUserAnswers(result);
  }
  @Get('results')
  async getResults( @Query('limit') limit = 10,  @Query('offset') offset = 0 ): Promise<{ data: any[]; total: number }> {

   let {data,total}=await this.testService.getPaginatedResults(limit,offset);
   return { data:data,total: total};
  }
  
}
