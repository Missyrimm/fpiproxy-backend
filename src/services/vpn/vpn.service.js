const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const pool = require("../../database/db");
const config = require("../../config");
const serverService = require("../server/server.service");

class VPNService {

    generateShortId() {
        return crypto.randomBytes(8).toString("hex");
    }

    async getClient(userId) {

        const result = await pool.query(
            `
            SELECT
                vpn_clients.*,
                servers.host,
                servers.port,
                servers.public_key
            FROM vpn_clients
            LEFT JOIN servers
                ON servers.id = vpn_clients.server_id
            WHERE vpn_clients.user_id = $1
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

        const server = await serverService.getDefault();

        if (!server)
            throw new Error("No VPN server available");

        const uuid = uuidv4();
        const shortId = this.generateShortId();

        const result = await pool.query(
            `
            INSERT INTO vpn_clients
            (
                user_id,
                uuid,
                short_id,
                server_id,
                server_ip,
                server_port
            )
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *
            `,
            [
                userId,
                uuid,
                shortId,
                server.id,
                server.host,
                server.port
            ]
        );

        return result.rows[0];

    }

    buildLink(client) {

        const host = client.host || client.server_ip;
        const port = client.port || client.server_port;
        const publicKey = client.public_key || config.xray.publicKey;

        return `vless://${client.uuid}@${host}:${port}?type=tcp&security=reality&pbk=${publicKey}&fp=chrome&sni=www.cloudflare.com&sid=${client.short_id}&flow=xtls-rprx-vision#FPIPROXY`;

    }

}

module.exports = new VPNService();
