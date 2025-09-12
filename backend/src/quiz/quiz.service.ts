import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()


export class QuizService {
    constructor(private db: DbService) { }

    async addQuizQuestion(data: any) {
        const { question, text, options, answer, rationale, category, type, extra_data } = data;
        const res = await this.db.query(`
      INSERT INTO quiz ( question, text, options, answer, rationale, category, type, extra_data ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *; `, [question, text || null, options || null, answer, rationale || null, category || null, type, extra_data ? JSON.stringify(extra_data) : null,
        ]);
        return res.rows[0];
    }



    // async getAllQuizzes(limit: number, offset: number, category?: string) {
    //     let query = `SELECT * FROM quiz`;
    //     const params: any[] = [];

    //     if (category) {
    //         query += ` WHERE category = $1`;
    //         params.push(category);
    //     }

    //     query += ` ORDER BY id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    //     params.push(limit, offset);

    //     const result = await this.db.query(query, params);
    //     return result.rows;
    // }
    async getAllQuizzes() {
            let query = `SELECT * FROM quiz`;
           
            const result = await this.db.query(query);
            return result.rows;
        }

    async getQuizById(id: string) {
        const result = await this.db.query(`SELECT * FROM quiz WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return { message: 'Quiz not found' };
        }
        return result.rows[0];
    }
}
