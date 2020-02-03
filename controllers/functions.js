const cheerio = require("cheerio");
const axios = require("axios");

module.exports = {
  parseData: function(html) {
    data = [];
    const $ = cheerio.load(html);
    $(".table tbody .torrent_files").each((index, element) => {
      let last = $(`.table tbody .date-column`)
        .eq(index + index + 1)
        .text();
      data.push({
        name: $(`.table tbody .torrent_files`)
          .eq(index)
          .text()
          .replace(/\s+/g, " "),
        size: $(`.table tbody .size-column`)
          .eq(index)
          .text(),
        lastData: last,
        type: $(`.table tbody .category-column`)
          .eq(index)
          .text()
      });
    });
    return data;
  },
  getIP: function(request) {
    let ip =
      request.headers["x-forwarded-for"] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      (request.connection.socket
        ? request.connection.socket.remoteAddress
        : null);
    return ip;
  },
  downloadAndCheckData: async function(ip) {
    let information = {};
    information.creationDate = new Date().toLocaleDateString();
    await axios
      .get(`http://ip-api.com/json/${ip}`)
      .then(response => {
        information.ip = response.data.query;
        information.internetProvider = response.data.org;
        information.hasPornography = false;
        information.hasChildPornography = false;
        information.geoData = {
          country: response.data.country,
          city: response.data.city,
          lat: response.data.lat,
          lon: response.data.lon
        };
      })
      .catch(error => {
        console.log(error);
      });
    await axios
      .get(`https://iknowwhatyoudownload.com/ru/peer/?ip=${ip}`)
      .then(response => {
        let torrent_info = this.parseData(response.data);
        information.content = torrent_info;
        for (let i = 0; i < information.content.length; i++) {
          if (information.content[i].type == "Порно")
            information.hasPornography = true;
          if (information.content[i].type == "Детское порно")
            information.hasChildPornography = true;
        }
      })

      .catch(error => {
        console.log(error);
      });
    return information;
    // console.log(information);
  }
};
