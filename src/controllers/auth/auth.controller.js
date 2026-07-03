const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const subscription = require("../../services/subscription/subscription.service");
const users = require("../../services/auth/user.service");
const jwt = require("../../services/auth/jwt.service");
const vpn = require("../../services/vpn/vpn.service");

class AuthController {

    async register(req, res) {

        try {

            const { email, password } = req.body;

            if (!email || !password) {

                return res.status(400).json({
                    success: false,
                    message: "Email and password required"
                });

            }

            const exists = await users.findByEmail(email);

            if (exists) {

                return res.status(400).json({
                    success: false,
                    message: "Email already exists"
                });

            }

            const hash = await bcrypt.hash(password, 10);

            const user = await users.create({
                email,
                password: hash,
                uuid: uuidv4()
            });

            // Создаем бесплатную подписку.
            // VPN пока НЕ создаем.
            await subscription.createFree(user.id);

            const token = jwt.generate(user);

            return res.json({

                success: true,

                token,

                user: {

                    id: user.id,
                    email: user.email,
                    plan: user.plan,
                    status: user.status

                }

            });

        }

        catch (e) {

            console.error(e);

            return res.status(500).json({

                success: false,
                message: e.message

            });

        }

    }

    async login(req, res) {

        try {

            const { email, password } = req.body;

            if (!email || !password) {

                return res.status(400).json({
                    success: false,
                    message: "Email and password required"
                });

            }

            const user = await users.findByEmail(email);

            if (!user) {

                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });

            }

            const ok = await bcrypt.compare(password, user.password);

            if (!ok) {

                return res.status(401).json({
                    success: false,
                    message: "Wrong password"
                });

            }

            const token = jwt.generate(user);

            const client = await vpn.getClient(user.id);

            return res.json({

                success: true,

                token,

                user: {

                    id: user.id,
                    email: user.email,
                    plan: user.plan,
                    status: user.status

                },

                vpn: client ? {

                    uuid: client.uuid,
                    shortId: client.short_id,
                    link: vpn.buildLink(client)

                } : null

            });

        }

        catch (e) {

            console.error(e);

            return res.status(500).json({

                success: false,
                message: e.message

            });

        }

    }

}

module.exports = new AuthController();
