exports.index = function(request, response) {
  response.send("Главная страница");
};
exports.post = function(request, response) {
  response.send("О сайте");
};
