const pool = require("../../database/db");
const vpn = require("../vpn/vpn.service");
const syncXray = require("../../jobs/syncXray.job");

class ActivatorService {

    async activate(userId) {

        let client = await vpn.getClient(userId);

        if (!client) {

            client = await vpn.create(userId);

        }

        await pool.query(
            `
            UPDATE vpn_clients
            SET enabled = true
            WHERE user_id = $1
            `,
            [userId]
        );

        client = await vpn.getClient(userId);

        await syncXray.run();

        return {

            success: true,

            client,

            link: vpn.buildLink(client)

        };

    }

}

module.exports = new ActivatorService();
