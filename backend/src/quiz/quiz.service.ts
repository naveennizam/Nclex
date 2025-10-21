import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()


export class QuizService {
    constructor(private db: DbService) { }

    async addQuizQuestion(data: any) {
        const {
            scenario,
            subject,
            system,
            type,
            score,
            questionBlocks
        } = data;

        const client = await this.db.getClient(); 

        try {
            await client.query('BEGIN');

            // Insert scenario
            const res = await client.query(
                `
              INSERT INTO scenario (scenario, subject, system, type, score)
              VALUES ($1, $2, $3, $4, $5)
              RETURNING id;
            `,
                [scenario, subject, system, type, score]
            );

            const scenario_id = res.rows[0].id;

            // Insert each question from questionBlocks
            for (const block of questionBlocks) {
                const { data } = block;

                if (!data) continue; // skip if no form data

                const { ques, opt, ans, rationale, format, lab } = data;
                const safeLab = lab?.trim() ? lab : null;
                await client.query(
                    `
              INSERT INTO questions (scenario_id, ques, opt, ans, rationale, format,lab)
              VALUES ($1, $2, $3, $4, $5, $6,$7)
              RETURNING id;
            `,
                    [scenario_id, ques, opt, JSON.stringify(ans), rationale, format, safeLab]
                );
            }

            await client.query('COMMIT');
            return { success: true, scenario_id };
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error inserting quiz question:', err);
            throw err;
        } finally {
            client.release();
        }
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
