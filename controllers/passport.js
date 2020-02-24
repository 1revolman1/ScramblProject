const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const db = require("../controllers/database");
const Admin = db.admin;

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "login" }, (login, password, done) => {
      // Match user
      Admin.findOne({
        login: login
      }).then(user => {
        if (!user) {
          return done(null, false, { message: "That login is not registered" });
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Admin.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
