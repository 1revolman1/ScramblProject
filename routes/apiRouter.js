// http://131f4a8d.ngrok.io/api/getOneIp?ip=188.163.96.186&token=tom
const express = require("express");
const apiController = require("../controllers/apiController.js");
const apiRouter = express.Router();

apiRouter.get("/getOneIp", apiController.apiGet);
apiRouter.get("/", apiController.api);

module.exports = apiRouter;
