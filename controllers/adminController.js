const functions = require("../controllers/functions.js");
const database = require("../controllers/database.js");

url = "https://550462df.ngrok.io";

exports.admin = function(request, respons) {
  let ip = functions.getIP(request);
  respons.render("admin.ejs", { ip: ip });
};
exports.postAdmin = async function(request, respons) {
  let ip = functions.getIP(request);
  if (!request.body) return respons.sendStatus(400);
  let result = database.adminDBFunc(request);
  console.log(result);
};
exports.adminPanel = function(request, respons) {
  let ip = functions.getIP(request);
  respons.render("panel.ejs", { ip: ip });
};
