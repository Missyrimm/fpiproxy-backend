const users = require("../../services/auth/user.service");

class UserController {

    async me(req, res) {

        try {

            const user = await users.findById(req.user.id);

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message: "User not found"

                });

            }

            return res.json({

                success: true,

                user

            });

        }

        catch (e) {

            console.error(e);

            res.status(500).json({

                success: false,

                message: e.message

            });

        }

    }

}

module.exports = new UserController();
