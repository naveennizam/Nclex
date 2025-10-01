
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DbService implements OnModuleInit {
  private pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Needed on Render or Heroku
    },
  });

  async onModuleInit() {
    await this.createTables(); // Automatically creates table at startup
  }

  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }
  private async createTables() {
    console.log("HHH")
    //   private async createTables() {
    //     try {
    //       // Enable pgcrypto extension (for UUID)
    //       await this.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    //       // Create users table
    //       await this.query(`
    //         CREATE TABLE IF NOT EXISTS users (
    //           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    //           email VARCHAR(255) NOT NULL UNIQUE,
    //           password VARCHAR(255),
    //           name VARCHAR(255),
    //           created_at TIMESTAMPTZ DEFAULT now(),
    //           active BOOLEAN DEFAULT true,
    //           last_login TIMESTAMPTZ,
    //           role VARCHAR(50) DEFAULT 'user',
    //           provider VARCHAR(50) DEFAULT 'form',
    //           image TEXT
    //         );
    //       `);

    //       // Create Quiz table 
    //       await this.query(`
    //         CREATE TABLE quiz (
    //   id SERIAL PRIMARY KEY,
    //   question TEXT NOT NULL,
    //   text TEXT,
    //   options TEXT[],
    //   answer TEXT[] NOT NULL,
    //   rationale TEXT,
    //   category VARCHAR(100),
    //   type VARCHAR(50) NOT NULL,
    //   extra_data JSONB 
    // );
    // `)

    //       console.log('✅ Users table created or already exists');
    //     } catch (error) {
    //       console.error('❌ Error creating users table:', error);
    //     }
    //   }

    // await this.query(`
    // CREATE TABLE scenario (
    //   id SERIAL PRIMARY KEY,
    //   scenario TEXT, 
    //   subject VARCHAR(100),
    //   system VARCHAR(100),
    //   type VARCHAR(50)
    // )
    //   `)
    // await this.query(`
    // CREATE TABLE questions (
    //   id SERIAL PRIMARY KEY,
    //   scenario_id INTEGER NOT NULL REFERENCES scenario(id) ON DELETE CASCADE,
    //   ques TEXT NOT NULL,
    //   opt TEXT,
    //   ans VARCHAR(10) NOT NULL,
    //   rationale TEXT,
    //   format VARCHAR(50)
    // )`)
    // await this.query(`
    // CREATE TABLE IF NOT EXISTS user_data (
    //     id SERIAL PRIMARY KEY,
    //     ques_id INTEGER NOT NULL,
    //     subject TEXT,
    //     system TEXT,
    //     user_ans TEXT,
    //     actual_ans TEXT NOT NULL,
    //     is_correct BOOLEAN DEFAULT false,
    //     user_id UUID NOT NULL,
    //     CONSTRAINT fk_user_data_user_id FOREIGN KEY (user_id)
    //         REFERENCES users (id)
    //         ON UPDATE NO ACTION
    //         ON DELETE CASCADE
    // );

    //         `)


    // CREATE TABLE ADAPTIVE_SESSION (
    //   ID SERIAL PRIMARY KEY, 
    //   USER_ID UUID NOT NULL, 
    //   TOTAL_QUESTIONS INTEGER NOT NULL, 
    //   CORRECT_ANSWERS INTEGER NOT NULL, 
    //   SCORE NUMERIC(5, 2) NOT NULL, 
    //   SUBJECT TEXT,
    //   QUES_TYPE TEXT,
    //   SESSION_DATE TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), 
    //   ANSWERS JSONB NOT NULL, 
    //   CONSTRAINT FK_USER FOREIGN KEY (USER_ID) REFERENCES USERS (ID) 
    // );


// CREATE TABLE IF NOT EXISTS practice_session
// (
//   ID SERIAL PRIMARY KEY, 
//     user_id uuid NOT NULL,
//     total_questions integer NOT NULL,
//     correct_answers integer NOT NULL,
//     score numeric(5,2) NOT NULL,
//     subject text,
//     ques_type text,
//     session_date timestamp with time zone NOT NULL DEFAULT now(),
   
//     CONSTRAINT fk_user FOREIGN KEY (user_id)
//         REFERENCES public.users (id) MATCH SIMPLE
//         ON UPDATE NO ACTION
//         ON DELETE NO ACTION
// )



  }
}

