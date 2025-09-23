import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class TestService {
  constructor(private db: DbService) { }

  async getQuestions(data: any) {

    const { subjects, systems, numQuestions } = data;

    const query = `
    SELECT scenario.*, questions.id AS question_id, questions.scenario_id , questions.ques , questions.opt , questions.ans , questions.rationale , questions.format
  FROM scenario
    JOIN questions ON questions.scenario_id = scenario.id
    WHERE
      (scenario.system = ANY($1) OR scenario.system IS NULL)
      AND (scenario.subject = ANY($2) OR scenario.subject IS NULL)
    LIMIT $3;
    `;
    const params = [systems, subjects, numQuestions];

    const res = await this.db.query(query, params);


    return res.rows;
  }


  async insertUserAnswers(result: any[]) {
    const fieldsPerRow = 7;

    const values = result
      .map((_, i) => {
        const offset = i * fieldsPerRow;
        const placeholders = Array.from({ length: fieldsPerRow }, (_, j) => `$${offset + j + 1}`);
        return `(${placeholders.join(', ')})`;
      })
      .join(', ');

    const params = result.flatMap((r) => [
      r.ques_id,
      r.subject,
      r.system,
      r.user_ans,
      r.actual_ans,
      r.is_correct,
      r.user_id
    ]);

    const query = `
      INSERT INTO user_data (ques_id, subject, system, user_ans, actual_ans, is_correct, user_id)
      VALUES ${values};
    `;




    return this.db.query(query, params);
  }


  async getPaginatedResults(limit = 10, offset = 0) {
    try {
      const [dataRes, countRes] = await Promise.all([
        this.db.query(
          `SELECT * FROM user_data ORDER BY id DESC LIMIT $1 OFFSET $2`,
          [limit, offset]
        ),
        this.db.query(`SELECT COUNT(*) FROM user_data`)
      ]);

    
      return {
        data: dataRes.rows,
        total: Number(countRes.rows[0].count)
      };
    } catch (error) {
      console.error('Error fetching paginated results:', error); // 👈 Add this
      return {
        data: [],
        total: 0
      };
    }
  }

}
