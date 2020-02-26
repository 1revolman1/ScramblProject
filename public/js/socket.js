var socket = io();
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});
// socket.on("GetAllTorrent",function())
// document.querySelectorAll(".cd-tabs__list li").forEach(button=>{
//     // button.addEventListener("click",function(event){
//     //     // console.log(event)
//     //     console.log(event.target)
//     // })
// })

$(".cd-tabs__list li").click(function(e){
    // console.log(e.currentTarget.classList[0])
    if(e.currentTarget.classList[0]=="selected")
        return
    console.log(e.currentTarget.classList[0])
    let textContent=e.currentTarget.textContent.replace( /\s/g, "");
    console.log(textContent)
    if(textContent=="AllTorrent")
        socket.emit("GetAllTorrent")
    if(textContent=="AllUsersAdmin")
        socket.emit("GetAllUsersAdmin")
})