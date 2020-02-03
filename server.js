const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const ngrok = require("ngrok");
const mongoose = require("mongoose");
const io = require("socket.io");

const ipRouter = require("./routes/ipRouter.js");

// const functions = require("./controllers/functions.js");
const app = express();

//Возможность парсить JSON на сервере
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let port = 8080;
url = "https://550462df.ngrok.io";

//Настройка загрузки файлов
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
//Фильтрация файлов на уровне сервера
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/vnd.ms-excel") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: storageConfig, fileFilter: fileFilter });

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

app.post("/csvupload/upload", upload.single("filedata"), function(
  request,
  respons,
  next
) {
  let csv_results = [];
  let filedata = request.file;
  if (!filedata) respons.render("404.ejs");
  fs.createReadStream(`./uploads/${filedata.originalname}`)
    .pipe(
      csv({
        separator: `;`,
        mapHeaders: ({ header, index }) => header.replace(/\s/g, "")
      })
    )
    .on("data", function(csv_content) {
      if (csv_content.Key != "") {
        csv_content.creationDate = new Date().toLocaleDateString();
        csv_results.push(csv_content);
      }
    })
    .on("end", () => {
      fs.unlinkSync(`./uploads/${filedata.originalname}`);
      respons.render("datacsvupload.ejs", { content: csv_results });
    });
});

app.use("/", ipRouter);

// http://131f4a8d.ngrok.io/api/getOneIp?ip=188.163.96.186&token=tom
app.get("/api/getOneIp", async function(request, respons) {
  let ip_to_find,
    token = "revolman";
  let ip =
    request.headers["x-forwarded-for"] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    (request.connection.socket
      ? request.connection.socket.remoteAddress
      : null);

  if (
    request.query.ip == undefined ||
    request.query.token == undefined ||
    request.query.token != "revolman"
  ) {
    ip_to_find = undefined;
    token = undefined;
    respons.send(JSON.stringify({ error: true }, null, 3));
  } else ip_to_find = request.query.ip;
  let information = {};
  await axios
    .get(`http://ip-api.com/json/${ip_to_find}`)
    .then(response => {
      information.ip = ip_to_find;
      information.internetProvider = response.data.org;
      information.hasPornography = false;
      information.hasChildPornography = false;
      information.geoData = {
        country: response.data.country,
        city: response.data.city,
        lat: response.data.lat,
        lon: response.data.lon
      };
    })
    .catch(error => {
      console.log(error);
    });
  await axios
    .get(`https://iknowwhatyoudownload.com/ru/peer/?ip=${ip_to_find}`)
    .then(response => {
      let torrent_info = functions.getData(response.data);
      information.content = torrent_info;
      for (let i = 0; i < information.content.length; i++) {
        if (information.content[i].type == "Порно")
          information.hasPornography = true;
        if (information.content[i].type == "Детское порно")
          information.hasChildPornography = true;
      }
    })
    .catch(error => {
      console.log(error);
    });
  information.creationDate = new Date().toLocaleDateString();
  console.log(
    "Пользователь c IP запросил информацию через GET: ",
    ip,
    "\n Из: ",
    information.geoData.country,
    " - ",
    information.geoData.city
  );
  mongoose.connect(
    "mongodb://localhost:27017/usersipdatabase",
    { useNewUrlParser: true },
    function(err) {
      if (err) return console.log(err);
      // Перед поиском зависимостей в базе данных
      if (token == "revolman")
        User.findOne({ ip: information.ip }, function(err, user) {
          // Поиск элемента!
          if (err) return console.log(err);
          if (!user) {
            // Отсутствие элемента и создание нового
            const newUser = new User(information);
            newUser.save(function(err) {
              if (err) return console.log(err);
            });
          } else if (
            user.creationDate.split(".")[1] !=
            information.creationDate.split(".")[1]
          ) {
            //  Необходимо обновить информацию про элемент!
            user.creationDate = information.creationDate;
            user.content = information.content;
            user.hasChildPornography = information.hasChildPornography;
            user.hasPornography = information.hasPornography;
            user.save(function(err) {
              if (err) return handleError(err); // сохранили!
            });
          }
        });
    }
  );

  respons.json(information);
});
app.get("/api", function(request, respons) {
  let ip =
    request.headers["x-forwarded-for"] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    (request.connection.socket
      ? request.connection.socket.remoteAddress
      : null);
  console.log(url);
  respons.render("api.ejs", { ip: ip, url: url });
});
app.get("/admin", function(request, respons) {
  let ip =
    request.headers["x-forwarded-for"] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    (request.connection.socket
      ? request.connection.socket.remoteAddress
      : null);
  respons.render("admin.ejs", { ip: ip });
});
app.post("/admin", function(request, response) {
  let ip =
    request.headers["x-forwarded-for"] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    (request.connection.socket
      ? request.connection.socket.remoteAddress
      : null);
  if (!request.body) return response.sendStatus(400);
  // console.log(request.body);
  mongoose.connect(
    "mongodb://localhost:27017/usersipdatabase",
    { useNewUrlParser: true },
    function(err) {
      if (err) return console.log(err);
      Admin.findOne(
        { login: request.body.login, password: request.body.password },
        function(err, user) {
          // Поиск элемента!
          if (err) return console.log(err);
          if (user) {
            response.render("panel.ejs", { ip: ip });
          } else {
            response.redirect("/admin");
          }
        }
      );
    }
  );
  // response.render("404.ejs");
  // response.sendStatus(200);
});
app.get("/admin/panel", function(request, respons) {
  let ip =
    request.headers["x-forwarded-for"] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    (request.connection.socket
      ? request.connection.socket.remoteAddress
      : null);
  respons.render("panel.ejs", { ip: ip });
});

app.get("/csvupload", function(request, respons) {
  let ip =
    request.headers["x-forwarded-for"] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    (request.connection.socket
      ? request.connection.socket.remoteAddress
      : null);
  respons.render("csvupload.ejs", { ip: ip });
});

//Обработчики
app.use("/public", express.static("public"));
app.set("view engine", "ejs");
app.set("json spaces", 40);

//Обработка страницы 404
app.use(function(req, res, next) {
  res.status(404).render("404.ejs");
});

// Функции

run();
