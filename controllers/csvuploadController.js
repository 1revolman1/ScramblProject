const fs = require("fs");
const multer = require("multer");
const csv = require("csv-parser");

const functions = require("../controllers/functions.js");

//Настройка загрузки файлов
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
//Фильтрация файлов на уровне сервера
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/vnd.ms-excel") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: storageConfig, fileFilter: fileFilter });

exports.index = function(request, response) {
  let ip = functions.getIP(request);
  response.render("csvupload.ejs", { ip: ip });
};
exports.post = function(request, respons, next) {
  let csv_results = [];
  let filedata = request.file;
  if (!filedata) respons.render("404.ejs");
  fs.createReadStream(`./uploads/${filedata.originalname}`)
    .pipe(
      csv({
        separator: `;`,
        mapHeaders: ({ header, index }) => header.replace(/\s/g, "")
      })
    )
    .on("data", function(csv_content) {
      if (csv_content.Key != "") {
        csv_content.creationDate = new Date().toLocaleDateString();
        csv_results.push(csv_content);
      }
    })
    .on("end", () => {
      fs.unlinkSync(`./uploads/${filedata.originalname}`);
      respons.render("datacsvupload.ejs", { content: csv_results });
    });
};
exports.uploader = upload;
