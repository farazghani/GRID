import { pg } from "./db.js";
async function migrate() {
    await pg.query(`
      CREATE TABLE IF NOT EXISTS tiles (
      id SERIAL PRIMARY KEY,
      owner_id TEXT,
      captured_at TIMESTAMP
    );
    `);
    console.log("connected db");
    console.log("creating indexes...");
    await pg.query(`CREATE INDEX IF NOT EXISTS idx_tiles_owner ON tiles(owner_id);`);
    const { rows } = await pg.query("SELECT COUNT(*) FROM tiles");
    if (Number(rows[0].count) === 0) {
        console.log("Seeding 500 tiles...");
        await pg.query(`
      INSERT INTO tiles (id)
      SELECT generate_series(1, 500);
    `);
    }
    const stats = await pg.query(`
    SELECT 
      COUNT(*) as total,
      COUNT(owner_id) as captured
    FROM tiles
  `);
    console.log(" Successfully seeded 500 tiles\n");
    console.table(stats.rows[0]);
    process.exit(0);
}
migrate();
//# sourceMappingURL=migrate.js.map