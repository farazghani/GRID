import { pg } from "./db.js";
async function migrateuser() {
    await pg.query(`CREATE TABLE IF NOT EXISTS users (
           id SERIAL PRIMARY KEY,
            username  TEXT,
            captured_at TIMESTAMP
          )`);
    console.log("connected to db and inserted user table");
    const row = await pg.query(`SELECT COUNT(*) FROM users`);
    if (row) {
        console.log("user table connected");
    }
    else {
        console.log("error while creating table");
    }
    process.exit(0);
}
migrateuser();
//# sourceMappingURL=migrateuser.js.map