const functions = require("../controllers/functions.js");
const database = require("../controllers/database.js");

exports.main = async function(request, respons) {
  //   console.log(ngrok.getUrl());
  let ip = functions.getIP(request);
  let information = await functions.downloadAndCheckData(ip);
  database.userDBFunc(information);
  respons.render("index.ejs", information);
};
exports.mainIp = async function(request, respons) {
  let ip_to_find;
  let ip = functions.getIP(request);
  if (request.query.ip == undefined) {
    ip_to_find = ip;
  } else ip_to_find = request.query.ip;
  let information = await functions.downloadAndCheckData(ip_to_find);
  database.userDBFunc(information);
  respons.render("ip.ejs", information);
};
