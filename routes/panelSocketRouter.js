const db = require("../controllers/database");
const Admin = db.admin;
const User = db.user;
const MongoLink = db.MongoLink;
const Mongoose = db.mongo;
console.log(MongoLink);
module.exports = function func(http) {
  let io = require("socket.io")(http);
  io.on("connection", function(socket) {
    console.log("a user connected");
    socket.emit("news", { hello: "world" });
    socket.on("my other event", function(data) {
      console.log(data);
    });
    socket.on("GetAllTorrent", function(e) {
      console.log("GET TORRENT");
      Mongoose.connect(MongoLink, { useNewUrlParser: true }, function(err) {
        console.log("Finnd in MONGOOSE");
        if (err) return console.log(err);
        User.find({}, function(err, user) {
          if (err) return console.log(err);
          //   console.log(user);
          socket.emit("GetAllTorrent", { user });
        });
      });
    });
    socket.on("GetAllUsersAdmin", function(e) {
      console.log("GET ALL USER ADMIN");
      Mongoose.connect(MongoLink, { useNewUrlParser: true }, function(err) {
        console.log("Finnd in MONGOOSE");
        if (err) return console.log(err);
        Admin.find({}, function(err, admin) {
          if (err) return console.log(err);
          console.log(admin);
        });
      });
    });
    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
  });
};
