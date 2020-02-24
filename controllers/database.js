const mongoose = require("mongoose");
const functions = require("../controllers/functions.js");
const MongoLink =
  "mongodb+srv://revolman:dudoser1488@cluster0-vw4cf.mongodb.net/ScrmableProject?retryWrites=true&w=majority";

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
      minlength: 4
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
  MongoLink: MongoLink,
  userDBFunc: function(information) {
    mongoose.connect(MongoLink, { useNewUrlParser: true }, function(err) {
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
    });
  }
};
