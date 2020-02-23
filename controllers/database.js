const mongoose = require("mongoose");
const functions = require("../controllers/functions.js");

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
// let admin = new Schema(
//   {
//     login: {
//       type: String,
//       unique: true,
//       index: true,
//       minlength: 4,
//       maxlength: 8
//     },
//     password: String
//   },
//   { versionKey: false }
// );
const admin = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    login: {
      type: String,
      unique: true,
      index: true,
      minlength: 4,
      maxlength: 8
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    date: {
      type: Date,
      default: Date.now
    },
    havePrevilegium: { type: Boolean, default: false }
  },
  { versionKey: false }
);

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
    let userResult;
    await mongoose.connect(
      "mongodb://localhost:27017/usersipdatabase",
      { useNewUrlParser: true },
      async function(err) {
        if (err) return console.log(err);
        await Admin.findOne(
          {
            login: request.body.login,
            password: functions.hex(request.body.password)
          },
          function(err, user) {
            // Поиск элемента!
            if (err) return console.log(err);
            if (user) {
              // functions.appFunc(res => {
              //   // console.log(request.session);
              // });
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
