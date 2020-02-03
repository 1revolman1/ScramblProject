const functions = require("../controllers/functions.js");
const database = require("../controllers/database.js");

url = "https://550462df.ngrok.io";

exports.api = function(request, respons) {
  //   console.log(ngrok.getUrl());
  let ip = functions.getIP(request);
  respons.render("api.ejs", { ip: ip, url: url });
};
exports.apiGet = async function(request, respons) {
  let ip_to_find,
    token = "revolman",
    ip = functions.getIP(request);
  if (
    request.query.ip == undefined ||
    request.query.token == undefined ||
    request.query.token != "revolman"
  ) {
    ip_to_find = undefined;
    token = undefined;
    respons.send(JSON.stringify({ error: true }, null, 3));
  } else ip_to_find = request.query.ip;
  let information = await functions.downloadAndCheckData(ip_to_find);
  database.userDBFunc(information);
  respons.json(information);
};
