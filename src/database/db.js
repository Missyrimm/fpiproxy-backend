const { Pool } = require("pg");
const config = require("../config");

const pool = new Pool(config.db);

pool.connect()
    .then(() => {
        console.log("✅ PostgreSQL connected");
    })
    .catch((err) => {
        console.error("❌ PostgreSQL error:", err.message);
    });

module.exports = pool;
