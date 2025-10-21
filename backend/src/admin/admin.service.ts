import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);

    return `${date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })} ${date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    })}`;
};

@Injectable()
export class AdminService {
    constructor(private db: DbService) { }
    async GetUsers(user: string, limit, offset) {

        try {
            const [dataRes, countRes] = await Promise.all([
                this.db.query(
                    `SELECT * FROM users WHERE role = $1 ORDER BY id DESC LIMIT $2 OFFSET $3`,
                    [user, limit, offset]
                ),
                this.db.query(
                    `SELECT COUNT(*) FROM users WHERE role = $1`,
                    [user]
                )
            ]);

            const formattedUsers = dataRes.rows.map(user => ({
                ...user,
                created_at: formatDateTime(user.created_at),
                last_login: user.last_login == null ? null : formatDateTime(user.last_login),

            }));

            return {
                data: formattedUsers,
                total: Number(countRes.rows[0].count),
            };

        } catch (error) {
            console.error("DB error:", error);
            return {
                data: [],
                total: 0,
            };
        }

    }

    async GetOtherMembers() {

        try {
            const excludedRole = 'user';

            const [dataRes, countRes] = await Promise.all([
                this.db.query(
                    `SELECT * FROM users WHERE role != $1 ORDER BY id DESC`,
                    [excludedRole]
                ),
                this.db.query(
                    `SELECT COUNT(*) FROM users WHERE role != $1`,
                    [excludedRole]
                )
            ]);

            const formattedUsers = dataRes.rows.map(user => ({
                ...user,
                created_at: formatDateTime(user.created_at),
                last_login: user.last_login == null ? null : formatDateTime(user.last_login),

            }));

            return {
                data: formattedUsers,
                total: Number(countRes.rows[0].count),
            };



        } catch (error) {
            console.error(error);
            return {
                data: [],
                total: 0
            };
        }

    }


    async GetUserByID(user_id: string) {
        type UUID = string & { readonly brand: unique symbol };
        const id = user_id as UUID;
        try {

            const res =await this.db.query(
                `SELECT * FROM users WHERE id = $1 `,
                [id]
            )
            return res.rows[0]



        } catch (error) {
            console.error(error);
            return []
        }

    }

    async changeActivation(user_id: string,is_active:boolean) {
        type UUID = string & { readonly brand: unique symbol };
        const id = user_id as UUID;
        try {

            const res = await this.db.query(
                `UPDATE users SET active = $1 WHERE id = $2`,
                [is_active, id]
            );
            
            return res.rows[0]



        } catch (error) {
            console.error(error);
            return 
        }
    }
}
