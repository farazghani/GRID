import { pg } from '../db.js';

export  async function createUser(username: string){
   const result =  await pg.query(`INSERT INTO users (username)
                    VALUES($1)
                    RETURNING * `, [username]);
    return result.rows[0];    
}

