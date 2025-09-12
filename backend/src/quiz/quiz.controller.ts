// src/quiz/quiz.controller.ts
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) { }


    @Post('add-quiz')
    async addQuizQuestion(@Body() body: any) {
        try {
             await this.quizService.addQuizQuestion(body);
            return { message: '✅ Quiz question added successfully' };
        } catch (error) {

            return { message: '❌ Failed to add quiz question' };
        }
    }

    // GET /quiz — get all quizzes (optional: pagination, filtering)
    @Get('get-all-quiz')
    // async getAllQuizzes(
    //     @Query('limit') limit?: string,
    //     @Query('offset') offset?: string,
    //     @Query('category') category?: string
    // ) {
    //     const l = limit ? parseInt(limit) : 20;
    //     const o = offset ? parseInt(offset) : 0;
    //     return this.quizService.getAllQuizzes(l, o, category);
    // }
    async getAllQuizzes(){
      
        return this.quizService.getAllQuizzes();
    }


    // GET /quiz/:id — get a specific quiz by ID
    @Get(':id')
    async getQuizById(@Param('id') id: string) {
        return this.quizService.getQuizById(id);
    }
}
