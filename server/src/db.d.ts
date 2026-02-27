import { Pool } from "pg";
import { Redis } from "ioredis";
export declare const pg: Pool;
export declare const redis: Redis;
export declare function initDB(): Promise<void>;
//# sourceMappingURL=db.d.ts.map