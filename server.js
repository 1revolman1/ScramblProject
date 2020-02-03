const express = require("express");
const bodyParser = require("body-parser");

const ngrok = require("ngrok");
// const mongoose = require("mongoose");
// const io = require("socket.io");

const ipRouter = require("./routes/ipRouter.js");
const csvuploadRouter = require("./routes/csvuploadRouter.js");
const apiRouter = require("./routes/apiRouter.js");
const adminRouter = require("./routes/adminRouter.js");
const app = express();

let port = 8080;

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

// https://api.mylnikov.org/geolocation/wifi?bssid={wifi-bssid}

app.use("/", ipRouter);
app.use("/csvupload", csvuploadRouter);
app.use("/api", apiRouter);
app.use("/admin", adminRouter);
// app.get("/admin", function(request, respons) {
//   let ip =
//     request.headers["x-forwarded-for"] ||
//     request.connection.remoteAddress ||
//     request.socket.remoteAddress ||
//     (request.connection.socket
//       ? request.connection.socket.remoteAddress
//       : null);
//   respons.render("admin.ejs", { ip: ip });
// });
// app.post("/admin", function(request, response) {
//   let ip =
//     request.headers["x-forwarded-for"] ||
//     request.connection.remoteAddress ||
//     request.socket.remoteAddress ||
//     (request.connection.socket
//       ? request.connection.socket.remoteAddress
//       : null);
//   if (!request.body) return response.sendStatus(400);
//   // console.log(request.body);
//   mongoose.connect(
//     "mongodb://localhost:27017/usersipdatabase",
//     { useNewUrlParser: true },
//     function(err) {
//       if (err) return console.log(err);
//       Admin.findOne(
//         { login: request.body.login, password: request.body.password },
//         function(err, user) {
//           // Поиск элемента!
//           if (err) return console.log(err);
//           if (user) {
//             response.render("panel.ejs", { ip: ip });
//           } else {
//             response.redirect("/admin");
//           }
//         }
//       );
//     }
//   );
//   // response.render("404.ejs");
//   // response.sendStatus(200);
// });
// app.get("/admin/panel", function(request, respons) {
//   let ip =
//     request.headers["x-forwarded-for"] ||
//     request.connection.remoteAddress ||
//     request.socket.remoteAddress ||
//     (request.connection.socket
//       ? request.connection.socket.remoteAddress
//       : null);
//   respons.render("panel.ejs", { ip: ip });
// });

//Возможность парсить JSON на сервере
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Обработчики
app.use("/public", express.static("public"));
app.set("view engine", "ejs");
app.set("json spaces", 40);

//Обработка страницы 404
app.use(function(req, res, next) {
  res.status(404).render("404.ejs");
});

run();
