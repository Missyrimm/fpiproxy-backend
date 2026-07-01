require("dotenv").config();

module.exports = {

    app: {
        name: process.env.PROJECT_NAME || "FPIPROXY",
        port: Number(process.env.PORT) || 3000,
        env: process.env.NODE_ENV || "development"
    },

    jwt: {
        secret: process.env.JWT_SECRET
    },

    db: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },

    server: {
        ip: process.env.SERVER_IP
    },

    xray: {
        config: process.env.XRAY_CONFIG,
        template: process.env.XRAY_TEMPLATE,
        publicKey: process.env.REALITY_PUBLIC_KEY,
        privateKey: process.env.REALITY_PRIVATE_KEY
    }

};
