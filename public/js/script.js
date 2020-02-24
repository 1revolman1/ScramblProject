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
  if (document.querySelectorAll(".csv-uploaded").length > 0) {
    $("tr").on("click", function(e) {
      let controller = new AbortController();
      let ip = e.currentTarget.children[1].textContent.split(":")[0];
      try {
        fetch(`${location.origin}/api/getOneIp?ip=${ip}&token=revolman`, {
          signal: controller.signal
        })
          .then(res => res.json())
          .then(res => {
            // console.log(res, e);
            // let div = `<div class="clicked-content">gfdsgfdg</div>`;
            // e.currentTarget.outerHTML += div;
          });
      } catch (err) {
        if (err.name == "AbortError") {
          // обработать ошибку от вызова abort()
          console.log("Перервано");
        } else {
          throw err;
        }
      }

      // let response = await fetch(
      //   `${location.origin}/api/getOneIp?ip=${ip}&token=revolman`,
      //   {
      //     signal: controller.signal
      //   }
      // );
      // let json = await response.json();
      // console.log(json);
      // .then(res => res.json())
      // .then(res => console.log(res));
    });
  }
  if(document.querySelectorAll(".panel-for-user").length>0){
    	$("li").click(function(e) {
			  e.preventDefault();
			  $("li").removeClass("selected");
			  $(this).addClass("selected");
			});

  }
});
