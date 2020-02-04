const io = require("socket.io");
const functions = require("../controllers/functions.js");
const database = require("../controllers/database.js");

url = "https://550462df.ngrok.io";

exports.admin = function(request, respons) {
  let ip = functions.getIP(request);
  respons.render("admin.ejs", { ip: ip });
};
exports.postAdmin = function(request, respons) {
  if (!request.body) return respons.sendStatus(400);
  let ip = functions.getIP(request);
  database.adminDBFunc(request, (err, result) => {
    if (err) return console.log(err);
    else if (result == 200) respons.render("panel.ejs", { ip: ip });
    else respons.redirect("/admin");
  });
};
exports.adminPanel = function(request, respons) {
  let ip = functions.getIP(request);
  respons.render("panel.ejs", { ip: ip });
};
