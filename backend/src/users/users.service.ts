
import { Injectable, UnauthorizedException ,NotFoundException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DbService } from '../db/db.service';

export type User = {
  userId: number;
  email: string;
  password: string;
};

@Injectable()

export class UsersService {
  constructor(private db: DbService) { }

  async findByEmail(email: string) {
    const res = await this.db.query('SELECT * FROM users WHERE email = $1', [email]);
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
  async UserEditName(name: string, email: string) {
    const result = await this.db.query(
      'UPDATE users SET name = $1 WHERE email = $2 RETURNING *',
      [name, email]
    );

    if (result.rowCount === 0) {
      throw new UnauthorizedException('User not found');
    }

    return result.rows[0];

  }

  async UserEditPassword(email: string, curr_password: string, new_password: string) {
    const result = await this.db.query(  'SELECT * FROM users WHERE email = $1', [email] );
  
    const user = result.rows[0];
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.password) {
      const hashed = await bcrypt.hash(new_password, 10);
      await this.db.query('UPDATE users SET password = $1 WHERE email = $2 RETURNING *', [hashed, email]);
      return { message: 'Password set successfully' };
    }
    
    const isMatch = await bcrypt.compare(curr_password, user.password);
  
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }
  
    const hashedNewPassword = await bcrypt.hash(new_password, 10);
 
    const updateResult = await this.db.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING *',
      [hashedNewPassword, email]
    );
  
    return {
      message: 'Password updated successfully',
      user: updateResult.rows[0],
    };
  }
  
}