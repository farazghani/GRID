import { pg } from '../db.js';
export async function createUser(username) {
    const result = await pg.query(`INSERT INTO users (username)
                    VALUES($1)
                    RETURNING * `, [username]);
    return result.rows[0];
}
//# sourceMappingURL=userService.js.map