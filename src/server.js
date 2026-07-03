const config = require("./config");
const app = require("./app");

require("./database/db");

const subscriptionCron = require("./cron/subscription.cron");

subscriptionCron.start();

app.listen(config.app.port, () => {

    console.log("");

    console.log("======================================");

    console.log(" FPIPROXY Backend v2");

    console.log("======================================");

    console.log(`Port: ${config.app.port}`);

    console.log(`Environment: ${config.app.env}`);

    console.log("");

});	
