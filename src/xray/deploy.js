const fs = require("fs/promises");
const config = require("../config");

class Deploy {

    async apply(tempConfig) {

        await fs.copyFile(
            tempConfig,
            config.xray.config
        );

        return true;

    }

}

module.exports = new Deploy();	
