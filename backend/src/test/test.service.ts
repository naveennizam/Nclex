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


  async insertInPractice(payload) {
    const values = [
      payload.user_id,
      payload.total_quesions,
      payload.correct_answers,
      payload.score,
      payload.subject,
      payload.ques_type
    ];
    const query = `
  INSERT INTO PRACTICE_SESSION (
    user_id, total_questions, correct_answers, score, subject, ques_type
  )  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id `;

    const result = await this.db.query(query, values);
    return result.rows[0].id;

  }

  async insertInUsedQuestions(practice_session_id: number, used_questions: any[]) {
    const now = new Date().toISOString(); // or use in DB default


    const updatedAttempts = used_questions.map(attempt => ({
      ...attempt,
      practice_session_id: practice_session_id,
      attempted_at: now
    }));

    const fieldsPerRow = 11;

    const values = updatedAttempts
      .map((_, i) => {
        const offset = i * fieldsPerRow;
        const placeholders = Array.from({ length: fieldsPerRow }, (_, j) => `$${offset + j + 1}`);
        return `(${placeholders.join(', ')})`;
      })
      .join(', ');

    const params = updatedAttempts.flatMap((r) => [
      r.user_id,
      r.question_id,
      r.attempt_number,
      r.selected_option,
      r.correct_option,
      r.practice_session_id,
      r.is_correct,
      r.attempted_at,
      r.subject,
      r.system,
      r.time_taken_secs
    ]);

    const query = `
      INSERT INTO used_questions (user_id,question_id,attempt_number,selected_option,correct_option,practice_session_id,is_correct,attempted_at,subject, system, time_taken_secs) VALUES ${values}; `;

    try {
      return await this.db.query(query, params);
    } catch (err) {
      console.error('Failed to insert into used_questions:', err);
      throw err;
    }

  }


  async getPractice(user_id: string, limit = 10, offset = 0) {
    try {
      const [dataRes, countRes] = await Promise.all([
        this.db.query(
          `SELECT * FROM practice_session 
           WHERE user_id = $1 
           ORDER BY id DESC 
           LIMIT $2 OFFSET $3`,
          [user_id, limit, offset]
        ),
        this.db.query(`SELECT COUNT(*) FROM practice_session WHERE user_id = $1`,
          [user_id])
      ]);

      // Format session_date for each row
      const formattedData = dataRes.rows.map(row => {
        const rawDate = row.session_date;
        const score = row.score + '%'
        const formattedDate = new Date(rawDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        return {
          ...row,
          formatted_date: formattedDate,
          score: score
        };
      });
      return {
        data: formattedData,
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

  async getDetailResults(user_id: string, practice_session_id: number, limit = 10, offset = 0) {
    try {
      const [dataRes, countRes] = await Promise.all([
        this.db.query(
          `SELECT * FROM used_questions 
           WHERE user_id = $1 AND practice_session_id = $2
           ORDER BY id DESC 
           LIMIT $3 OFFSET $4`,
          [user_id, practice_session_id, limit, offset]
        ),
        this.db.query(
          `SELECT COUNT(*) FROM used_questions 
           WHERE user_id = $1 AND practice_session_id = $2`,
          [user_id, practice_session_id]
        )
      ]);

      // Format session_date for each row (if session_date exists)
      const formattedData = dataRes.rows.map(row => {
        const rawDate = row.attempted_at;
        const formattedDate = rawDate
          ? new Date(rawDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
          : null;

        return {
          ...row,
          formatted_date: formattedDate,

        };
      });

      return {
        data: formattedData,
        total: Number(countRes.rows[0].count)
      };

    } catch (error) {
      console.error('Error fetching paginated results:', error);
      return {
        data: [],
        total: 0
      };
    }
  }



  async getPracticeSessionsById(user_id: string, practice_session_id: number) {
    try {
      const row = await this.db.query(
        `SELECT score ,total_questions, correct_answers FROM practice_session 
         WHERE user_id = $1 AND id = $2 `,
        [user_id, practice_session_id]
      )

      return { data: row.rows[0] };

    } catch (error) {
      console.error('Error fetching paginated results:', error);
      return { data: [] };
    }
  }

  async getQuesAnswer(id: number, ques_id: number) {
    try {
      const row = await this.db.query(
        `SELECT uq.id AS used_question_id,uq.correct_option,uq.selected_option,q.id AS question_id,q.ques,q.opt,q.rationale,q.format,q.scenario_id,s.scenario FROM used_questions uq JOIN questions q ON uq.question_id = q.id LEFT JOIN scenario s ON q.scenario_id = s.id WHERE uq.id = $1 AND uq.question_id = $2;`,
        [id, ques_id]
      )

      return { data: row.rows[0] };

    } catch (error) {
      console.error('Error fetching paginated results:', error);
      return { data: [] };
    }
  }

}
