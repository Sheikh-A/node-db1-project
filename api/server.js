const express = require("express");
const AccountRouter = require("../Accounts/accounts-router.js");
const mw = require('../custom/middleware.js');
const logger = mw.logger;

const helmet = require('helmet');
const morgan = require('morgan');
const db = require("../data/dbConfig.js");

const server = express();

//global mw

server.use(helmet());
server.use(morgan("dev"));
server.use(logger);

server.use(express.json());
server.use("/api/accounts", AccountRouter);

server.get("/api", (req,res) => {
    res.status(200).json({ api: "up up and away" });
})

server.get("/", addName, (req, res) => {
    const nameInsert = (req.name) ? `${req.name}` : '';
    console.log('req.name is:', req.name );

    res.send(`
    <h2>Ali's Project</h2>
    <p>API DB Project Data Persistence</p>
    `);
});

function addName(req, res, next) {
    req.name = 'Web API';
    next();
};

server.use(function (req, res, next) {
    res
      .status(404)
      .json({ message: "Ooops did not find what you are looking for" });
    next();
});


module.exports = server;
