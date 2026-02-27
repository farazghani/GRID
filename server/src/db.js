import { Pool } from "pg";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
export const pg = new Pool({
    connectionString: process.env.POSTGRES_URL,
});
const useRedisTls = process.env.REDIS_TLS === "true";
const redisUsername = process.env.REDIS_USERNAME ?? "default";
export const redis = process.env.REDIS_URL
    ? createClient({
        url: process.env.REDIS_URL,
        ...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}),
        ...(useRedisTls ? { socket: { tls: true } } : {}),
    })
    : createClient({
        username: redisUsername,
        ...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}),
        socket: {
            host: process.env.REDIS_HOST ?? "127.0.0.1",
            port: Number(process.env.REDIS_PORT ?? 6379),
            ...(useRedisTls ? { tls: true } : {}),
        },
    });
redis.on("error", (err) => console.error("Redis Client Error", err));
export async function initDB() {
    try {
        // Check Postgres
        await pg.query("SELECT 1");
        console.log("✅ PostgreSQL connection successful");
        // Check Redis
        await redis.connect();
        await redis.ping();
        console.log("✅ Redis connected");
    }
    catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
}
//# sourceMappingURL=db.js.map