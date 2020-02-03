const express = require("express");
const csvuploadController = require("../controllers/csvuploadController.js");
const csvuploadRouter = express.Router();

csvuploadRouter.post("/upload", csvuploadController.post);
csvuploadRouter.get("/", csvuploadController.index);

module.exports = csvuploadRouter;
