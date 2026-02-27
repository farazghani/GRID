import { pg, redis } from "../db.js";
export async function getAllTiles() {
    const res = await pg.query("SELECT * FROM tiles ORDER BY id");
    //console.log(res.rows);
    return res.rows;
}
export async function captureTile(tileId, userId) {
    const lockKey = `tile:${tileId}`;
    const lock = await redis.set(lockKey, userId, { NX: true });
    if (lock !== "OK") {
        return null;
    }
    try {
        const result = await pg.query(`UPDATE tiles
       SET owner_id = $1, captured_at = NOW()
       WHERE id = $2 AND owner_id IS NULL
       RETURNING *`, [userId, tileId]);
        console.log(result);
        if (result.rowCount === 0) {
            await redis.del(lockKey);
            return null;
        }
        return result.rows[0];
    }
    catch (err) {
        await redis.del(lockKey);
        throw err;
    }
}
export async function resetTilesForUser(userId) {
    const { rows } = await pg.query(`SELECT id FROM tiles WHERE owner_id = $1`, [userId]);
    if (rows.length === 0)
        return [];
    const tileIds = rows.map(r => r.id);
    await pg.query(`
        UPDATE tiles
        SET owner_id = NULL,
            captured_at = NULL
        WHERE owner_id = $1
        `, [userId]);
    const keys = tileIds.map(id => `tile:${id}`);
    if (keys.length) {
        await redis.del(keys);
    }
    return tileIds;
}
//# sourceMappingURL=tileService.js.map