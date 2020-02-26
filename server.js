const express = require("express");
const bodyParser = require("body-parser");
const ngrok = require("ngrok");
const ipRouter = require("./routes/ipRouter.js");
const csvuploadRouter = require("./routes/csvuploadRouter.js");
const apiRouter = require("./routes/apiRouter.js");
const adminRouter = require("./routes/adminRouter.js");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const http = require('http').createServer(app);
require("./routes/panelSocketRouter")(http);
require("./controllers/passport")(passport);
let port = 8080;

//Возможность парсить JSON на сервере
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

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
  await http.listen(port, () =>
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
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("json spaces", 40);

//Обработка страницы 404
app.use(function(req, res, next) {
  res.status(404).render("404.ejs");
});

run();