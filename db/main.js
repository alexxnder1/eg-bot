const mongoose = require('mongoose');
require('dotenv').config();

main().catch((err) => console.log(`[MongoDB ERROR] ${err}`));

async function main() {
    await mongoose.connect(process.env.SRV);
    console.log("[Mongoose] The connection with database was succesfully achieved.");
}