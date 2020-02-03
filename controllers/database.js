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
  mongo: mongoose
};
// module.exports = User;

// module.exports = Admin;
// module.exports = mongoose;
