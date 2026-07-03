const builder = require("../xray/builder");
const validator = require("../xray/validator");
const deploy = require("../xray/deploy");
const reload = require("../xray/reload");

class SyncXrayJob {

     async run() {

         const configPath = await builder.build();

         if (!configPath) {

             console.log("Skip Xray sync.");

             return;

         }

         await validator.validate(configPath);

         await deploy.apply(configPath);
 
         await reload.restart();
  
         console.log("✅ Xray synchronized");
 
    }

}

module.exports = new SyncXrayJob();

