const jwt = require("jsonwebtoken");
const config = require("../../config");

class JwtService {

    generate(user) {

        return jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            config.jwt.secret,
            {
                expiresIn: "30d"
            }
        );

    }

    verify(token) {

        return jwt.verify(token, config.jwt.secret);

    }

}

module.exports = new JwtService();
