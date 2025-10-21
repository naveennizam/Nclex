import { TestService } from './test.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) { }

  @Post('get-quiz')
  async getQuizQuestion(@Body() body: any) {
    try {

      let data = await this.testService.getQuestions(body);
      return { message: data };
    } catch (error) {

      return { message: ' Failed to add quiz question' };
    }
  }
  @Post('submit-answers')
  async submitAnswers(@Body() body: any) {
    const { practice_session, used_questions } = body;
  console.log(practice_session, used_questions)
    const practice_session_id = await this.testService.insertInPractice(practice_session);
  
  return await this.testService.insertInUsedQuestions(practice_session_id, used_questions);
  }
  

  @Get('results')
  async getResults(@Query('user_id')user_id,@Query('limit') limit = 10, @Query('offset') offset = 0): Promise<{ data: any[]; total: number }> {
    let { data, total } = await this.testService.getPractice(user_id,limit, offset);
    return { data: data, total: total };
  }

  @Get('detail_results')
  async getDetailResult(@Query('practice_session_id')practice_session_id,@Query('user_id')user_id,@Query('limit') limit = 10, @Query('offset') offset = 0): Promise<{ data: any[]; total: number }> {
    let { data, total } = await this.testService.getDetailResults(user_id,practice_session_id,limit, offset);
    return { data: data, total: total };
  }

@Get("practice_session_by_id")
async getPracticeSessionById(@Query('practice_session_id')practice_session_id,@Query('user_id')user_id): Promise<{ data: any[] }> {
  let { data } = await this.testService.getPracticeSessionsById(user_id,practice_session_id);
  return  data;
}
@Get("check_ques")
async getQuesAns(@Query('ques_id')ques_id,@Query('id')id): Promise<{ data: any[] }> {
  let { data } = await this.testService.getQuesAnswer(id,ques_id);
  return  data;
}
}
