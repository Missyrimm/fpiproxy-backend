const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const pool = require("../../database/db");
const config = require("../../config");

class VPNService {

    generateShortId() {

        return crypto.randomBytes(8).toString("hex");

    }

    async getClient(userId) {

        const result = await pool.query(
            `
            SELECT *
            FROM vpn_clients
            WHERE user_id = $1
            LIMIT 1
            `,
            [userId]
        );

        return result.rows[0] || null;

    }

    async create(userId) {

        const existing = await this.getClient(userId);

        if (existing)
            return existing;

        const uuid = uuidv4();

        const shortId = this.generateShortId();

        const result = await pool.query(
            `
            INSERT INTO vpn_clients
            (
                user_id,
                uuid,
                short_id,
                server_ip,
                server_port
            )
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
            `,
            [
                userId,
                uuid,
                shortId,
                config.server.ip,
                443
            ]
        );

        return result.rows[0];

    }

    buildLink(client) {

        return `vless://${client.uuid}@${client.server_ip}:${client.server_port}?type=tcp&security=reality&pbk=${config.xray.publicKey}&fp=chrome&sni=www.cloudflare.com&sid=${client.short_id}&flow=xtls-rprx-vision#FPIPROXY`;

    }

}

module.exports = new VPNService();
