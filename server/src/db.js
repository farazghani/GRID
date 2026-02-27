import { Pool } from "pg";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
const rawPostgresUrl = process.env.POSTGRES_URL;
const usePgSsl = process.env.PG_SSL === "true";
const pgRejectUnauthorized = process.env.PG_SSL_REJECT_UNAUTHORIZED !== "false";
const usePgLibpqCompat = process.env.PG_USE_LIBPQ_COMPAT === "true";
function withPgCompat(url) {
    try {
        const parsed = new URL(url);
        const sslmode = parsed.searchParams.get("sslmode");
        const hasCompat = parsed.searchParams.has("uselibpqcompat");
        if (sslmode === "require" && !hasCompat) {
            parsed.searchParams.set("uselibpqcompat", "true");
            return parsed.toString();
        }
    }
    catch {
        // Keep original URL if parsing fails.
    }
    return url;
}
const postgresUrl = rawPostgresUrl && usePgLibpqCompat ? withPgCompat(rawPostgresUrl) : rawPostgresUrl;
export const pg = new Pool({
    connectionString: postgresUrl,
    ...(usePgSsl
        ? {
            // Cloud providers often require TLS; allow disabling cert validation when needed.
            ssl: { rejectUnauthorized: pgRejectUnauthorized },
        }
        : {}),
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