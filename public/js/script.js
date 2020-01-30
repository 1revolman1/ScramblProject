document.addEventListener("DOMContentLoaded", function() {
  if (document.querySelectorAll(".csv").length > 0) {
    document
      .querySelector(".container form input")
      .addEventListener("change", function(event) {
        if (event.target.files[0].type != "application/vnd.ms-excel") {
          event.target.value = "";
          alert("It's not CSV file. Please, reupload your CSV!");
        }
      });
  }
  if (document.querySelectorAll(".admin").length > 0) {
    // document
    //   .querySelector(".button-submit")
    //   .addEventListener("click", function(event) {
    //     event.preventDefault();
    //     if (
    //       document.querySelector(".second").value != "" &&
    //       document.querySelector(".third").value != ""
    //     ) {
    //       let login = document.querySelector(".second").value;
    //       let password = document.querySelector(".third").value;
    //       fetch("/admin", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ login: login, password: password })
    //       }).then(res => {
    //         // console.log(res);
    //         if (res.status == 404) {
    //           alert("Filed to login! Unknowing password and user!");
    //         }
    //       });
    //       // .then(res => {
    //       //   // console.log(res);
    //       //   // res.redirected();
    //       //   // if (res.ok) {
    //       //   //   document.location.href = "/admin/panel";
    //       //   // } else {
    //       //   //   document.location.href = "/404";
    //       //   // }
    //       // });
    //     }
    //   });
  }
  //   if (document.querySelectorAll(".csv-uploaded").length > 0) {
  //   }
});
