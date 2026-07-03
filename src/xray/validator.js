const { exec } = require("child_process");

class Validator {

    validate(configPath) {

        return new Promise((resolve, reject) => {

            exec(
                `xray run -test -config ${configPath}`,
                (error, stdout, stderr) => {

                    if (error) {
                        return reject(stderr || stdout);
                    }

                    resolve(true);

                }
            );

        });

    }

}

module.exports = new Validator();
