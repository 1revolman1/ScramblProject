const axios = require("axios");
// const mongoose = require("mongoose");
const functions = require("../controllers/functions.js");
const database = require("../controllers/database.js");

exports.main = async function(request, respons) {
  //   console.log(ngrok.getUrl());
  let ip = functions.getIP(request);
  let information = await functions.downloadAndCheckData(ip);
  database.userDBFunc(information);
  respons.render("index.ejs", information);
};
// exports.mainIp = async function(request, respons) {
//   let ip_to_find;
//   let ip = functions.getIP(request);
//   if (request.query.ip == undefined) {
//     ip_to_find = ip;
//   } else ip_to_find = request.query.ip;
//   let information = {};
//   information.creationDate = new Date().toLocaleDateString();
//   await axios
//     .get(`http://ip-api.com/json/${ip_to_find}`)
//     .then(response => {
//       information.ip = ip_to_find;
//       information.internetProvider = response.data.org;
//       information.hasPornography = false;
//       information.hasChildPornography = false;
//       information.geoData = {
//         country: response.data.country,
//         city: response.data.city,
//         lat: response.data.lat,
//         lon: response.data.lon
//       };
//     })
//     .catch(error => {
//       console.log(error);
//     });
//   await axios
//     .get(`https://iknowwhatyoudownload.com/ru/peer/?ip=${ip_to_find}`)
//     .then(response => {
//       // console.log(getData(response.data));
//       let torrent_info = functions.getData(response.data);
//       information.content = torrent_info;
//       for (let i = 0; i < information.content.length; i++) {
//         if (information.content[i].type == "Порно")
//           information.hasPornography = true;
//         if (information.content[i].type == "Детское порно")
//           information.hasChildPornography = true;
//       }
//     })
//     .catch(error => {
//       console.log(error);
//     });
//   console.log(
//     `Присоединился пользователь ${ip} и смотрит чужой IP: `,
//     ip_to_find
//   );
//   information.creationDate = new Date().toLocaleDateString();
//   database.mongo.connect(
//     "mongodb://localhost:27017/usersipdatabase",
//     { useNewUrlParser: true },
//     function(err) {
//       if (err) return console.log(err);
//       // Перед поиском зависимостей в базе данных
//       database.user.findOne({ ip: information.ip }, function(err, user) {
//         // Поиск элемента!
//         if (err) return console.log(err);
//         if (!user) {
//           // Отсутствие элемента и создание нового
//           const newUser = new database.user(information);
//           newUser.save(function(err) {
//             if (err) return console.log(err);
//           });
//         } else if (
//           user.creationDate.split(".")[1] !=
//           information.creationDate.split(".")[1]
//         ) {
//           //  Необходимо обновить информацию про элемент!
//           user.creationDate = information.creationDate;
//           user.content = information.content;
//           user.hasChildPornography = information.hasChildPornography;
//           user.hasPornography = information.hasPornography;
//           user.save(function(err) {
//             if (err) return handleError(err); // сохранили!
//           });
//         }
//       });
//     }
//   );
//   respons.render("ip.ejs", information);
// };
