const pool = require("../../database/db");

class UserService {

    async findByEmail(email) {

        const result = await pool.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            LIMIT 1
            `,
            [email]
        );

        return result.rows[0] || null;

    }

    async findById(id) {

        const result = await pool.query(
            `
            SELECT
                id,
                email,
                uuid,
                plan,
                status,
                devices,
                traffic_used,
                traffic_limit,
                expires_at,
                created_at
            FROM users
            WHERE id = $1
            LIMIT 1
            `,
            [id]
        );

        return result.rows[0] || null;

    }

    async create({ email, password, uuid }) {

        const result = await pool.query(
            `
            INSERT INTO users
            (
                email,
                password,
                uuid
            )
            VALUES ($1,$2,$3)
            RETURNING *
            `,
            [
                email,
                password,
                uuid
            ]
        );

        return result.rows[0];

    }

}

module.exports = new UserService();

