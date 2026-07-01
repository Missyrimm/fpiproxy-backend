const jwt = require("../services/auth/jwt.service");

module.exports = (req, res, next) => {

    try {

        const header = req.headers.authorization;

        if (!header) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

        }

        const token = header.replace("Bearer ", "");

        const user = jwt.verify(token);

        req.user = user;

        next();

    }

    catch (e) {

        return res.status(401).json({

            success: false,

            message: "Invalid token"

        });

    }

};
