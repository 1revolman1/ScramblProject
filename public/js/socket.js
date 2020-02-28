document.addEventListener("DOMContentLoaded", function(e) {
  if (document.querySelector(".panel-for-user")) {
    document.querySelector(".adminPanel-with-tabs").style.marginTop = `${
      document.querySelector("header").offsetHeight
    }px`;
  }
});

var socket = io();
socket.on("news", function(data) {
  console.log(data);
  socket.emit("my other event", { my: "data" });
});
socket.on("GetAllTorrent", function(data) {
  let text = "";
  //   data.user.forEach(element => {
  //     console.log(element.geoData.country);
  //     //   element.geoData.country
  //   });
  // torrentUser.internetProvider == ""
  //     ? "Неизвестен"
  //     : torrentUser.internetProvider
  data.user.forEach((torrentUser, index) => {
    text += `<tr>
                      <th scope="row">${index + 1}</th>
                      <td class="name-of-torrent">${torrentUser.ip}</td>
                      <td>${torrentUser.geoData.country}</td>
                      <td>${
                        torrentUser.internetProvider == ""
                          ? "Неизвестен"
                          : torrentUser.internetProvider
                      }</td>
                      <td>${torrentUser.content.length}</td>
                      <td>${torrentUser.hasPornography ? "Да" : "Нет"}</td>
                      <td>${torrentUser.hasChildPornography ? "Да" : "Нет"}</td>
                      <td>${torrentUser.creationDate}</td>
                    </tr>`;
  });
  console.log(data);
  document.querySelector("#tab-AllTorrent .form-group tbody").innerHTML = text;
});
// document.querySelectorAll(".cd-tabs__list li").forEach(button=>{
//     // button.addEventListener("click",function(event){
//     //     // console.log(event)
//     //     console.log(event.target)
//     // })
// })

$(".cd-tabs__list li").click(function(e) {
  // console.log(e.currentTarget.classList[0])
  if (e.currentTarget.classList[0] == "selected") return;
  console.log(e.currentTarget.classList[0]);
  let textContent = e.currentTarget.textContent.replace(/\s/g, "");
  console.log(textContent);
  if (textContent == "AllTorrent") socket.emit("GetAllTorrent");
  if (textContent == "AllUsersAdmin") socket.emit("GetAllUsersAdmin");
});
