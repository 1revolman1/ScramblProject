const mongoose = require("mongoose");

//Настройка базы данных
const Schema = mongoose.Schema;

// установка схемы
const userScheme = new Schema(
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
const admin = new Schema(
  {
    login: String,
    password: String
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
  }
};
// module.exports = User;

// module.exports = Admin;
// module.exports = mongoose;
