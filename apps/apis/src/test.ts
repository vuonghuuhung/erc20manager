import db from "./db/db.js";

const test = async () => {
    const result = await db.query.daos.findMany();
    console.log(result);
}

test();