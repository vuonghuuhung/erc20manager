import db from "./db/db.js";

const test = async () => {
    const currentHolder = await db.query.tokenHolders.findFirst({
        where: (tokenHolders, { eq }) => (eq(tokenHolders.id, "0x0daF6F7176B3624F7C54A08bdE46f0de484d96d0-0xa294d8218E3A35cF5135D200E685592Ed01079B1")),
    })
    console.log(currentHolder);
}

test();