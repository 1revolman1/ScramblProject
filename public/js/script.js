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
  //   if (document.querySelectorAll(".csv-uploaded").length > 0) {
  //   }
});
