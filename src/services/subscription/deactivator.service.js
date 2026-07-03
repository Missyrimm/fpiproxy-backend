const pool = require("../../database/db");
const syncXray = require("../../jobs/syncXray.job");

class DeactivatorService {

    async deactivate(userId) {

        await pool.query(
            `
            UPDATE vpn_clients
            SET enabled = false
            WHERE user_id = $1
            `,
            [userId]
        );

        await syncXray.run();

        return {
            success: true
        };

    }

}

module.exports = new DeactivatorService();
