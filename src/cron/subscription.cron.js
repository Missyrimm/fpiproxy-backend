const cron = require("node-cron");

const pool = require("../database/db");
const syncXray = require("../jobs/syncXray.job");

class SubscriptionCron {

    start() {

        cron.schedule("* * * * *", async () => {

            try {

                const expired = await pool.query(`
                    SELECT user_id
                    FROM subscriptions
                    WHERE
                        status='active'
                    AND
                        expires_at <= NOW()
                `);

                if (!expired.rows.length)
                    return;

                for (const row of expired.rows) {

                    await pool.query(`
                        UPDATE subscriptions
                        SET status='expired'
                        WHERE user_id=$1
                        AND status='active'
                    `,[row.user_id]);

                    await pool.query(`
                        UPDATE vpn_clients
                        SET enabled=false
                        WHERE user_id=$1
                    `,[row.user_id]);

                }

                await syncXray.run();

                console.log(`Expired users: ${expired.rows.length}`);

            }

            catch(err){

                console.error(err);

            }

        });

        console.log("Subscription cron started.");

    }

}

module.exports = new SubscriptionCron();
