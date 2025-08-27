import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DbService {
  private pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }
}
