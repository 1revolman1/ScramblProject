// http://131f4a8d.ngrok.io/api/getOneIp?ip=188.163.96.186&token=tom
const express = require("express");
const adminController = require("../controllers/adminController.js");
const adminRouter = express.Router();

adminRouter.post("/", adminController.postAdmin);
adminRouter.get("/", adminController.admin);
adminRouter.get("/panel", adminController.adminPanel);

module.exports = adminRouter;
