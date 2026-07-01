const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
const routes = require("./routes");

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        name: "FPIPROXY",

        version: "2.0.0",

        status: "online"

    });

});

module.exports = app;
