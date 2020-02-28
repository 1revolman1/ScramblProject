const functions = require("../controllers/functions.js");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const db = require("../controllers/database");
const Admin = db.admin;
const User = db.user;
const MongoLink = db.MongoLink;
const Mongoose = db.mongo;
url = "https://550462df.ngrok.io";

exports.admin = function(request, respons) {
  let ip = functions.getIP(request);
  respons.render("admin.ejs", { ip: ip });
};
exports.registration = function(request, respons) {
  let ip = functions.getIP(request);
  respons.render("register", { ip: ip });
};
exports.registrationPOST = function(request, respons) {
  const { name, login, password, password2 } = request.body;
  let errors = [];

  if (!name || !login || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    respons.render("register.ejs", {
      errors,
      name,
      login,
      password,
      password2
    });
  } else {
    db.mongo.connect(MongoLink, { useNewUrlParser: true }, function(err) {
      if (err) return console.log(err);
      // Перед поиском зависимостей в базе данных
      Admin.findOne({ login: login }).then(user => {
        if (user) {
          errors.push({ msg: "Email already exists" });
          respons.render("register", {
            errors,
            name,
            login,
            password,
            password2
          });
        } else {
          const newUser = new Admin({
            name,
            login,
            password
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  request.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
                  respons.redirect("/admin/panel");
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    });
  }
};
exports.postAdmin = function(request, respons, next) {
  passport.authenticate("local", {
    successRedirect: "/admin/panel",
    failureRedirect: "/admin",
    failureFlash: true
  })(request, respons, next);
};
exports.adminPanel = function(request, respons) {
  let ip = functions.getIP(request);
  Mongoose.connect(MongoLink, { useNewUrlParser: true }, function(err) {
    console.log("Finnd in MONGOOSE");
    if (err) return console.log(err);
    User.find({}, function(err, user) {
      if (err) return console.log(err);
      //   console.log(user);
      respons.render("panel.ejs", { ip: ip, logout: true, torrentUser: user });
    });
  });
};
exports.logout = function(request, respons) {
  request.logout();
  request.flash("success_msg", "You are logged out");
  respons.redirect("/admin");
};
exports.logout = function(request, respons) {
  request.logout();
  request.flash("success_msg", "You are logged out");
  respons.redirect("/admin");
};
