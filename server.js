const express = require("express");
const bodyParser = require("body-parser");
const ngrok = require("ngrok");
const ipRouter = require("./routes/ipRouter.js");
const csvuploadRouter = require("./routes/csvuploadRouter.js");
const apiRouter = require("./routes/apiRouter.js");
const adminRouter = require("./routes/adminRouter.js");
const app = express();

let port = 8080;

//Возможность парсить JSON на сервере
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// (async function() {
//   const url = await ngrok.connect(port);
//   const apiUrl = ngrok.getUrl();
//   console.log(apiUrl);
//   mongoose.connect(
//     "mongodb://localhost:27017/usersipdatabase",
//     { useNewUrlParser: true },
//     function(err) {
//       if (err) return console.log(err);
//       server.listen(port, function() {
//         console.log(
//           `\nServer waiting for connection and listening on: ${port}\nUse this link to connect to this server: ${url}`
//         );
//       });
//     }
//   );
// })();

const run = async () => {
  await app.listen(port, () =>
    console.log(
      `\nServer waiting for connection and listening on: ${port}\nUse this link to connect to this server:`
    )
  );
};

//Роутинг
app.use("/", ipRouter);
app.use("/csvupload", csvuploadRouter);
app.use("/api", apiRouter);
app.use("/admin", adminRouter);

// https://api.mylnikov.org/geolocation/wifi?bssid={wifi-bssid}

//Обработчики
app.use("/public", express.static("public"));
app.set("view engine", "ejs");
app.set("json spaces", 40);

//Обработка страницы 404
app.use(function(req, res, next) {
  res.status(404).render("404.ejs");
});

run();

// var crypto = require("crypto");
// var name = "revolman";
// var hash = crypto
//   .createHash("md5", Math.round(new Date().valueOf() * Math.random()) + "")
//   .update("revolman")
//   .digest("hex");
// console.log(hash); // 9b74c9897bac770ffc029102a200c5de
