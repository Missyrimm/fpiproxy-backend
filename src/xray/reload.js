const { exec } = require("child_process");

class Reload {

    restart() {

        return new Promise((resolve, reject) => {

            exec(
                "systemctl restart xray",
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

module.exports = new Reload();	
