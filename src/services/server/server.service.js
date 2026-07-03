const pool = require("../../database/db");

class ServerService {

    async getDefault() {

        const result = await pool.query(`
            SELECT *
            FROM servers
            WHERE enabled = true
            ORDER BY id
            LIMIT 1
        `);

        return result.rows[0] || null;

    }

    async getById(id) {

        const result = await pool.query(`
            SELECT *
            FROM servers
            WHERE id = $1
            LIMIT 1
        `, [id]);

        return result.rows[0] || null;

    }

    async getAll() {

        const result = await pool.query(`
            SELECT *
            FROM servers
            WHERE enabled = true
            ORDER BY country,name
        `);

        return result.rows;

    }

}

module.exports = new ServerService();
