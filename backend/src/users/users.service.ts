
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DbService } from '../db/db.service';

export type User = {
  userId: number;
  email: string;
  password: string;
};

@Injectable()
// export class UsersService {
//   private readonly users: User[] = [
//     { userId: 1, email: 'john@gmail.com', password: bcrypt.hashSync('changeme', 10) }, // hashed password },
//     { userId: 2, email: 'maria@example.com', password: 'guess' },
//   ];

//   async findByEmail(email: string): Promise<User | undefined> {

//     return this.users.find(user => user.email === email);
//   }
// }

export class UsersService {
  constructor(private db: DbService) { }

  async findByEmail(email: string) {
    const res = await this.db.query('SELECT * FROM users WHERE email = $1', [email]);
    //  console.log('res.rows[0];',res.rows[0])
    return res.rows[0];
  }

  async createUser(email: string, password: string, name: string) {
    const hashed = await bcrypt.hash(password, 10);

    const result = await this.db.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *;',
      [email, hashed, name],
    );

    return result.rows[0];
  }
  async createUserByGoogle(user: any) {


    const result = await this.db.query(
      'INSERT INTO users (email, name,image,provider,password) VALUES ($1, $2, $3 , $4, $5) RETURNING *;',
      [user.email, user.name, user.image, 'Google', null],
    );

    return result.rows[0];
  }
  async updateLastLogin(userId: string) {
    const result = await this.db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1 RETURNING *;',
      [userId],
    );
    return result.rows[0];
  }
  async findById(email: string) {
    const result = await this.db.query('SELECT name, image FROM users WHERE email = $1',
      [email],);
    return result.rows[0]
  }

}