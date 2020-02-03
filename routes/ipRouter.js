const express = require("express");
const ipController = require("../controllers/ipController.js");
const ipRouter = express.Router();

ipRouter.get("/ip", ipController.mainIp);
ipRouter.get("/", ipController.main);

module.exports = ipRouter;
