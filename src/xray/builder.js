const fs = require("fs/promises");
const pool = require("../database/db");
const config = require("../config");

class Builder {

    async build() {

        const result = await pool.query(`
            SELECT
                vc.uuid,
                vc.short_id
            FROM vpn_clients vc
            JOIN subscriptions s
                ON s.user_id = vc.user_id
            WHERE
                vc.enabled = true
                AND s.status = 'active'
                AND s.expires_at > NOW()
            ORDER BY vc.id
        `);
        
        if (result.rows.length === 0) {

            console.log("No active VPN clients. Skip Xray build.");

            return null;

        }        

        const clients = result.rows.map(client => ({
            id: client.uuid,
            flow: "xtls-rprx-vision"
        }));

        const shortIds = result.rows.map(client => client.short_id);

        const json = {
            log: {
                loglevel: "warning"
            },
            inbounds: [
                {
                    listen: "0.0.0.0",
                    port: 443,
                    protocol: "vless",
                    settings: {
                        clients,
                        decryption: "none"
                    },
                    streamSettings: {
                        network: "tcp",
                        security: "reality",
                        realitySettings: {
                            show: false,
                            dest: "www.cloudflare.com:443",
                            serverNames: [
                                "www.cloudflare.com"
                            ],
                            privateKey: config.xray.privateKey,
                            shortIds
                        }
                    },
                    sniffing: {
                        enabled: true,
                        destOverride: [
                            "http",
                            "tls",
                            "quic"
                        ]
                    }
                }
            ],
            outbounds: [
                {
                    protocol: "freedom"
                },
                {
                    protocol: "blackhole",
                    tag: "blocked"
                }
            ]
        };

        await fs.writeFile(
            "/tmp/fpiproxy-xray.json",
            JSON.stringify(json, null, 2)
        );

        return "/tmp/fpiproxy-xray.json";

    }

}

module.exports = new Builder();

