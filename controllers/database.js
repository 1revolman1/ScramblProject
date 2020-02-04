const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const crypto = require("crypto");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
//Настройка базы данных
const Schema = mongoose.Schema;

// установка схемы
let userScheme = new Schema(
  {
    ip: String,
    creationDate: String,
    internetProvider: String,
    hasPornography: Boolean,
    hasChildPornography: Boolean,
    geoData: Object,
    content: Object
  },
  { versionKey: false }
);
let admin = new Schema(
  {
    login: {
      type: String,
      unique: true,
      index: true,
      minlength: 4,
      maxlength: 8
    },
    password: String
  },
  { versionKey: false }
);
// Math.round(new Date().valueOf() * Math.random()) + "";
function hexpass(password) {
  return crypto
    .createHash("md5", Math.round(new Date().valueOf() * Math.random()) + "")
    .update(password)
    .digest("hex");
}

const User = mongoose.model("User", userScheme);
const Admin = mongoose.model("Admin", admin);

module.exports = {
  user: User,
  admin: Admin,
  mongo: mongoose,
  userDBFunc: function(information) {
    mongoose.connect(
      "mongodb://localhost:27017/usersipdatabase",
      { useNewUrlParser: true },
      function(err) {
        if (err) return console.log(err);
        // Перед поиском зависимостей в базе данных
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
  },
  adminDBFunc: async function(request) {
    await mongoose.connect(
      "mongodb://localhost:27017/usersipdatabase",
      { useNewUrlParser: true },
      async function(err) {
        if (err) return console.log(err);
        // let hex = hexpass(request.body.password);
        await Admin.findOne(
          {
            login: request.body.login,
            password: hexpass(request.body.password)
          },
          function(err, user) {
            // Поиск элемента!
            if (err) return console.log(err);
            if (user) {
              userResult = 200;
            } else {
              userResult = 404;
            }
          }
        );
      }
    );
    return userResult;
  }
};
