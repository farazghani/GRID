import { initDB , pg , redis }from "../src/db.js";

async function test(){
    await initDB();
    const res = await pg.query("SELECT NOW()");
    console.log(res.rows[0]);
    await redis.set("test:key" , "hello");
    const val = await redis.get("test:key");
    console.log(val);
    process.exit(0);
}

test();