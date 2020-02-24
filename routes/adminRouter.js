// http://131f4a8d.ngrok.io/api/getOneIp?ip=188.163.96.186&token=tom
const express = require("express");
const passport = require("passport");
const adminController = require("../controllers/adminController.js");
const adminRouter = express.Router();
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require("../controllers/auth");

adminRouter.post("/", adminController.postAdmin);
adminRouter.get("/", forwardAuthenticated, adminController.admin);
adminRouter.get(
  "/register",
  forwardAuthenticated,
  adminController.registration
);
adminRouter.post("/register", adminController.registrationPOST);
adminRouter.get("/panel", ensureAuthenticated, adminController.adminPanel);
adminRouter.get("/logout", adminController.logout);

module.exports = adminRouter;
