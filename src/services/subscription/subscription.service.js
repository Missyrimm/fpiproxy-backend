const pool = require("../../database/db");

class SubscriptionService {

    async createFree(userId) {

        const planResult = await pool.query(
            `
            SELECT *
            FROM plans
            WHERE code='FREE'
            LIMIT 1
            `
        );

        if (!planResult.rows.length)
            throw new Error("FREE plan not found");

        const plan = planResult.rows[0];

        const result = await pool.query(
            `
            INSERT INTO subscriptions
            (
                user_id,
                plan_id,
                expires_at
            )
            VALUES
            (
                $1,
                $2,
                NOW() + ($3 || ' days')::interval
            )
            RETURNING *
            `,
            [
                userId,
                plan.id,
                plan.duration_days
            ]
        );

        return result.rows[0];

    }

    async getActive(userId) {

        const result = await pool.query(
            `
            SELECT
                s.*,
                p.name,
                p.code
            FROM subscriptions s
            JOIN plans p
                ON p.id=s.plan_id
            WHERE
                s.user_id=$1
            AND
                s.status='active'
            LIMIT 1
            `,
            [userId]
        );

        return result.rows[0] || null;

    }

}

module.exports = new SubscriptionService();
