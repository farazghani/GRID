import { Pool } from "pg";
import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();
export const pg = new Pool({
    connectionString: process.env.POSTGRES_URL,
});
export const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
});
export async function initDB() {
    try {
        // Check Postgres
        await pg.query("SELECT 1");
        console.log("✅ PostgreSQL connection successful");
        // Check Redis
        await redis.ping();
        console.log("✅ Redis connected");
    }
    catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
}
//# sourceMappingURL=db.js.map