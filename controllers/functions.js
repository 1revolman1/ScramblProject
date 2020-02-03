const cheerio = require("cheerio");
module.exports.getData = function(html) {
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
};
